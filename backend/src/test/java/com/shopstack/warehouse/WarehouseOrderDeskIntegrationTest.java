package com.shopstack.warehouse;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.security.jwt.JwtUtil;
import com.shopstack.warehouse.dev.DevOrderItemRepository;
import com.shopstack.warehouse.dev.DevOrderRepository;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.OrderPackingRepository;
import com.shopstack.warehouse.repository.OrderPickItemRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** W-21 · Order Desk read + lifecycle (customer contract §3). */
@SpringBootTest
@AutoConfigureMockMvc
class WarehouseOrderDeskIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private DevOrderRepository orders;
    @Autowired
    private DevOrderItemRepository orderItems;
    @Autowired
    private InventoryRowRepository inventory;
    @Autowired
    private OrderPickItemRepository pickItems;
    @Autowired
    private OrderPackingRepository packings;
    @Autowired
    private StockMovementRepository movements;

    private FulfillmentTestSupport fixture;
    private String staffToken;

    @BeforeEach
    void setUp() {
        fixture = new FulfillmentTestSupport(orders, orderItems, inventory, pickItems, packings, movements);
        fixture.reset();
        staffToken = "Bearer " + jwtUtil.generate("maya@shopstack.dev", Map.of(
                JwtUtil.CLAIM_WAREHOUSE_ID, FulfillmentTestSupport.WAREHOUSE,
                JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));
    }

    @Test
    void listIsAnUnwrappedArrayOfTheWarehousesOrders() throws Exception {
        fixture.order("T-ORD-1", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);
        fixture.item("T-ORD-1", "T-ITEM-1", FulfillmentTestSupport.SKU_A, "Alpha", 1);

        mockMvc.perform(get("/api/warehouses/{w}/orders", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-1"))
                .andExpect(jsonPath("$[0].status").value("pending"))
                .andExpect(jsonPath("$[0].itemCount").value(1))
                // Serialised as an explicit null, not omitted: the frontend reads the key
                // before confirmation.
                .andExpect(jsonPath("$[0].deliveryDate").value(org.hamcrest.Matchers.nullValue()));
    }

    @Test
    void statusFilterSelectsOnlyThatStatus() throws Exception {
        fixture.order("T-ORD-P", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);
        fixture.order("T-ORD-C", FulfillmentTestSupport.WAREHOUSE, OrderStatus.CONFIRMED,
                LocalDate.now().plusDays(1));

        mockMvc.perform(get("/api/warehouses/{w}/orders", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("status", "pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-P"));

        mockMvc.perform(get("/api/warehouses/{w}/orders", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("status", "confirmed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-C"));
    }

    @Test
    void pagingSlicesWithoutRepeatingRows() throws Exception {
        for (int i = 1; i <= 5; i++) {
            fixture.order("T-ORD-" + i, FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);
        }

        mockMvc.perform(get("/api/warehouses/{w}/orders", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("page", "0").param("pageSize", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/warehouses/{w}/orders", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("page", "2").param("pageSize", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void detailCarriesCustomerItemsAndStockFromInventory() throws Exception {
        fixture.twoItemOrder("T-ORD-D", OrderStatus.CONFIRMED);

        mockMvc.perform(get("/api/warehouses/{w}/orders/{id}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-D")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value("T-ORD-D"))
                .andExpect(jsonPath("$.status").value("confirmed"))
                .andExpect(jsonPath("$.customer.name").value(FulfillmentTestSupport.CUSTOMER))
                .andExpect(jsonPath("$.customer.city").value("Pune"))
                .andExpect(jsonPath("$.items", hasSize(2)))
                .andExpect(jsonPath("$.items[0].sku").value(FulfillmentTestSupport.SKU_A))
                .andExpect(jsonPath("$.items[0].binLocation").value(FulfillmentTestSupport.BIN_A))
                .andExpect(jsonPath("$.items[0].stockOnHand").value(10));
    }

    @Test
    void orderBelongingToAnotherWarehouseIs404Not403() throws Exception {
        fixture.order("T-ORD-X", FulfillmentTestSupport.OTHER_WAREHOUSE, OrderStatus.PENDING, null);

        // 404 rather than 403 on purpose: a 403 would confirm the id exists elsewhere.
        mockMvc.perform(get("/api/warehouses/{w}/orders/{id}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-X")
                        .header("Authorization", staffToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Order not found."));
    }

    @Test
    void confirmSetsStatusAndDeliveryDate() throws Exception {
        fixture.order("T-ORD-K", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/confirm",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-K")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"deliveryDate\":\"" + LocalDate.now().plusDays(3) + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("confirmed"))
                .andExpect(jsonPath("$.deliveryDate").value(LocalDate.now().plusDays(3).toString()));
    }

    @Test
    void confirmOnAlreadyConfirmedReturns409() throws Exception {
        fixture.order("T-ORD-N", FulfillmentTestSupport.WAREHOUSE, OrderStatus.CONFIRMED,
                LocalDate.now().plusDays(1));

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/confirm",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-N")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"deliveryDate\":\"" + LocalDate.now().plusDays(2) + "\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("This order has already been confirmed or cancelled."));
    }

    @Test
    void pastDeliveryDateReturns422() throws Exception {
        fixture.order("T-ORD-PD", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/confirm",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-PD")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"deliveryDate\":\"" + LocalDate.now().minusDays(1) + "\"}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Choose a valid delivery date."));
    }

    @Test
    void missingDeliveryDateReturns422() throws Exception {
        fixture.order("T-ORD-MD", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/confirm",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-MD")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Choose a valid delivery date."));
    }

    @Test
    void cancelPendingOrderSucceeds() throws Exception {
        fixture.order("T-ORD-CX", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/cancel",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-CX")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("cancelled"));
    }

    @Test
    void cancelAfterShipReturns409() throws Exception {
        fixture.order("T-ORD-S", FulfillmentTestSupport.WAREHOUSE, OrderStatus.SHIPPED,
                LocalDate.now().minusDays(1));

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/cancel",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-S")
                        .header("Authorization", staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("This order can no longer be cancelled."));
    }

    @Test
    void cancellingTwiceReturns409() throws Exception {
        fixture.order("T-ORD-DC", FulfillmentTestSupport.WAREHOUSE, OrderStatus.CANCELLED, null);

        mockMvc.perform(post("/api/warehouses/{w}/orders/{id}/cancel",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-DC")
                        .header("Authorization", staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("This order can no longer be cancelled."));
    }
}
