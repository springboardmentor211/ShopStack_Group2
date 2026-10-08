package com.shopstack.warehouse;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.security.jwt.JwtUtil;
import com.shopstack.warehouse.dev.DevOrderItemRepository;
import com.shopstack.warehouse.dev.DevOrderRepository;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.entity.StockMovement;
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

import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** W-21 · Pickup queue, per-item toggling and the transactional complete (contract §4). */
@SpringBootTest
@AutoConfigureMockMvc
class WarehousePickupIntegrationTest {

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

    private void tick(String orderId, String itemId) throws Exception {
        mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/item",
                FulfillmentTestSupport.WAREHOUSE, orderId)
                .header("Authorization", staffToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"itemId\":\"" + itemId + "\",\"picked\":true}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(true))
        // Toggle must not carry status or trackingId — the contract shows {"ok":true}.
        .andExpect(jsonPath("$.status").doesNotExist())
        .andExpect(jsonPath("$.trackingId").doesNotExist());
    }

    @Test
    void queueShowsConfirmedOrdersAsToPick() throws Exception {
        fixture.twoItemOrder("T-ORD-Q", OrderStatus.CONFIRMED);

        mockMvc.perform(get("/api/warehouses/{w}/pickup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-Q"))
                .andExpect(jsonPath("$[0].stage").value("to_pick"))
                .andExpect(jsonPath("$[0].itemCount").value(2))
                .andExpect(jsonPath("$[0].binSummary").value(
                        FulfillmentTestSupport.BIN_A + ", " + FulfillmentTestSupport.BIN_B));
    }

    @Test
    void queueExcludesPickedOrdersFromToPickButIncludesThemInAll() throws Exception {
        fixture.twoItemOrder("T-ORD-P1", OrderStatus.PICKED);
        fixture.twoItemOrder("T-ORD-P2", OrderStatus.PICKED);

        mockMvc.perform(get("/api/warehouses/{w}/pickup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("stage", "to_pick"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/warehouses/{w}/pickup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("stage", "picked"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].stage").value("picked"));
    }

    @Test
    void pickListResolvesBinFromInventory() throws Exception {
        fixture.twoItemOrder("T-ORD-L", OrderStatus.CONFIRMED);

        mockMvc.perform(get("/api/warehouses/{w}/pickup/{id}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-L")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stage").value("to_pick"))
                .andExpect(jsonPath("$.pickList", hasSize(2)))
                .andExpect(jsonPath("$.pickList[0].itemId").value("T-ITEM-1"))
                .andExpect(jsonPath("$.pickList[0].productName").value("Alpha Widget"))
                .andExpect(jsonPath("$.pickList[0].binLocation").value(FulfillmentTestSupport.BIN_A))
                .andExpect(jsonPath("$.pickList[0].picked").value(false));
    }

    @Test
    void rereadingPickListPreservesPickedFlags() throws Exception {
        fixture.twoItemOrder("T-ORD-R", OrderStatus.CONFIRMED);
        tick("T-ORD-R", "T-ITEM-1");

        mockMvc.perform(get("/api/warehouses/{w}/pickup/{id}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-R")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pickList[0].picked").value(true))
                .andExpect(jsonPath("$.pickList[1].picked").value(false));
    }

    @Test
    void pickListForPendingOrderReturns409() throws Exception {
        fixture.order("T-ORD-PEN", FulfillmentTestSupport.WAREHOUSE, OrderStatus.PENDING, null);
        fixture.item("T-ORD-PEN", "T-ITEM-1", FulfillmentTestSupport.SKU_A, "Alpha", 1);

        mockMvc.perform(get("/api/warehouses/{w}/pickup/{id}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-PEN")
                        .header("Authorization", staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Order must be confirmed before picking."));
    }

    @Test
    void completeWithPartialPickReturns409AndChangesNothing() throws Exception {
        fixture.twoItemOrder("T-ORD-PART", OrderStatus.CONFIRMED);
        tick("T-ORD-PART", "T-ITEM-1");

        mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/complete",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-PART")
                        .header("Authorization", staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Not all items have been picked."));

        assertThat(movements.findByWarehouseIdOrderByAtDesc(FulfillmentTestSupport.WAREHOUSE)).isEmpty();
        assertThat(fixture.stockRows()).allSatisfy(row -> assertThat(row.getQty()).isEqualTo(10));
        assertThat(orders.findById("T-ORD-PART").orElseThrow().getStatus()).isEqualTo("confirmed");
    }

    @Test
    void completeDecrementsStockAndWritesOnePickMovementPerItem() throws Exception {
        fixture.twoItemOrder("T-ORD-OK", OrderStatus.CONFIRMED);
        tick("T-ORD-OK", "T-ITEM-1");
        tick("T-ORD-OK", "T-ITEM-2");

        mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/complete",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-OK")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true))
                .andExpect(jsonPath("$.status").value("picked"));

        assertThat(orders.findById("T-ORD-OK").orElseThrow().getStatus()).isEqualTo("picked");

        assertThat(inventory.findByWarehouseIdAndSkuAndBin(
                FulfillmentTestSupport.WAREHOUSE, FulfillmentTestSupport.SKU_A, FulfillmentTestSupport.BIN_A)
                .orElseThrow().getQty()).isEqualTo(9);
        assertThat(inventory.findByWarehouseIdAndSkuAndBin(
                FulfillmentTestSupport.WAREHOUSE, FulfillmentTestSupport.SKU_B, FulfillmentTestSupport.BIN_B)
                .orElseThrow().getQty()).isEqualTo(9);

        List<StockMovement> written = movements.findByWarehouseIdOrderByAtDesc(FulfillmentTestSupport.WAREHOUSE);
        assertThat(written).hasSize(2);
        assertThat(written).allSatisfy(m -> {
            assertThat(m.getType()).isEqualTo("Pick");
            assertThat(m.getToLoc()).isEqualTo("Pack staging");
            assertThat(m.getQty()).isEqualTo(1);
            assertThat(m.getId()).matches("MOV-\\d{4}");
        });
        assertThat(written).extracting(StockMovement::getFromLoc)
                .containsExactlyInAnyOrder(FulfillmentTestSupport.BIN_A, FulfillmentTestSupport.BIN_B);
    }

    @Test
    void completeWithInsufficientStockReturns409AndLeavesStockIntact() throws Exception {
        fixture.order("T-ORD-SHORT", FulfillmentTestSupport.WAREHOUSE, OrderStatus.CONFIRMED, null);
        fixture.item("T-ORD-SHORT", "T-ITEM-1", FulfillmentTestSupport.SKU_A, "Alpha", 5);
        fixture.stock(FulfillmentTestSupport.SKU_A, FulfillmentTestSupport.BIN_A, 2);
        tick("T-ORD-SHORT", "T-ITEM-1");

        mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/complete",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-SHORT")
                        .header("Authorization", staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(
                        "Not enough stock in " + FulfillmentTestSupport.BIN_A + " to complete this pick."));

        assertThat(movements.findByWarehouseIdOrderByAtDesc(FulfillmentTestSupport.WAREHOUSE)).isEmpty();
        assertThat(inventory.findByWarehouseIdAndSkuAndBin(
                FulfillmentTestSupport.WAREHOUSE, FulfillmentTestSupport.SKU_A, FulfillmentTestSupport.BIN_A)
                .orElseThrow().getQty()).isEqualTo(2);
        assertThat(orders.findById("T-ORD-SHORT").orElseThrow().getStatus()).isEqualTo("confirmed");
    }

    @Test
    void concurrentCompletesYieldOneSuccessAndOneConflict() throws Exception {
        fixture.twoItemOrder("T-ORD-RACE", OrderStatus.CONFIRMED);
        tick("T-ORD-RACE", "T-ITEM-1");
        tick("T-ORD-RACE", "T-ITEM-2");

        CyclicBarrier barrier = new CyclicBarrier(2);
        ExecutorService pool = Executors.newFixedThreadPool(2);

        Callable<Integer> complete = () -> {
            barrier.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/complete",
                            FulfillmentTestSupport.WAREHOUSE, "T-ORD-RACE")
                            .header("Authorization", staffToken))
                    .andReturn()
                    .getResponse()
                    .getStatus();
        };

        try {
            Future<Integer> first = pool.submit(complete);
            Future<Integer> second = pool.submit(complete);
            assertThat(List.of(first.get(30, TimeUnit.SECONDS), second.get(30, TimeUnit.SECONDS)))
                    .containsExactlyInAnyOrder(200, 409);
        } finally {
            pool.shutdownNow();
        }

        // Exactly one decrement, not two.
        assertThat(movements.findByWarehouseIdOrderByAtDesc(FulfillmentTestSupport.WAREHOUSE)).hasSize(2);
        assertThat(inventory.findByWarehouseIdAndSkuAndBin(
                FulfillmentTestSupport.WAREHOUSE, FulfillmentTestSupport.SKU_A, FulfillmentTestSupport.BIN_A)
                .orElseThrow().getQty()).isEqualTo(9);
    }

    @Test
    void toggleOnUnknownItemReturns404() throws Exception {
        fixture.twoItemOrder("T-ORD-TI", OrderStatus.CONFIRMED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/item",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-TI")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemId\":\"NOPE\",\"picked\":true}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Item not found on this order."));
    }

    @Test
    void untickReturnsTheLineToUnpicked() throws Exception {
        fixture.twoItemOrder("T-ORD-UN", OrderStatus.CONFIRMED);
        tick("T-ORD-UN", "T-ITEM-1");

        mockMvc.perform(post("/api/warehouses/{warehouseId}/pickup/{orderId}/item",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-UN")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemId\":\"T-ITEM-1\",\"picked\":false}"))
                .andExpect(status().isOk());

        InventoryRow untouched = inventory.findByWarehouseIdAndSkuAndBin(
                FulfillmentTestSupport.WAREHOUSE, FulfillmentTestSupport.SKU_A, FulfillmentTestSupport.BIN_A)
                .orElseThrow();
        assertThat(untouched.getQty()).isEqualTo(10);
    }
}
