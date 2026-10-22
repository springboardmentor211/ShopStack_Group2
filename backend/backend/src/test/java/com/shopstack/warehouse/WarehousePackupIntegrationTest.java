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
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** W-21 · Packup queue, detail, pack and ship (contract §5). */
@SpringBootTest
@AutoConfigureMockMvc
class WarehousePackupIntegrationTest {

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
    void detailAlwaysCarriesBothObjectsEvenBeforePacking() throws Exception {
        fixture.twoItemOrder("T-ORD-DET", OrderStatus.PICKED);

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup/{orderId}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-DET")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stage").value("to_pack"))
                .andExpect(jsonPath("$.packing").isMap())
                .andExpect(jsonPath("$.packing.boxSize").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$.packing.weightKg").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$.packing.packed").value(false))
                .andExpect(jsonPath("$.outbound").isMap())
                .andExpect(jsonPath("$.outbound.carrier").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$.outbound.trackingId").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$.outbound.shipped").value(false));
    }

    @Test
    void detailForUnpickedOrderReturns409() throws Exception {
        fixture.order("T-ORD-CONF", FulfillmentTestSupport.WAREHOUSE, OrderStatus.CONFIRMED,
                LocalDate.now().plusDays(1));

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup/{orderId}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-CONF")
                        .header("Authorization", staffToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Order has not been picked yet."));
    }

    @Test
    void stageFiltersPartitionTheQueue() throws Exception {
        fixture.twoItemOrder("T-ORD-A", OrderStatus.PICKED);
        fixture.twoItemOrder("T-ORD-B", OrderStatus.PACKED);
        fixture.twoItemOrder("T-ORD-C", OrderStatus.SHIPPED);

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("stage", "to_pack"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-A"))
                .andExpect(jsonPath("$[0].stage").value("to_pack"));

        // Packed-but-not-shipped reads as ready_to_ship by default...
        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[?(@.orderId=='T-ORD-B')].stage").value(
                        org.hamcrest.Matchers.contains("ready_to_ship")));

        // ...but reports itself as `packed` when that is the filter asked for.
        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("stage", "packed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-B"))
                .andExpect(jsonPath("$[0].stage").value("packed"));

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup", FulfillmentTestSupport.WAREHOUSE)
                        .header("Authorization", staffToken)
                        .param("stage", "shipped"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderId").value("T-ORD-C"));
    }

    @Test
    void packBeforePickingReturns409() throws Exception {
        fixture.twoItemOrder("T-ORD-PK9", OrderStatus.CONFIRMED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/pack",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-PK9")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"boxSize\":\"medium\",\"weightKg\":0.8}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Order must be picked before packing."));
    }

    @Test
    void invalidBoxSizeOrWeightReturns422() throws Exception {
        fixture.twoItemOrder("T-ORD-BAD", OrderStatus.PICKED);

        for (String body : new String[]{
                "{\"boxSize\":\"gigantic\",\"weightKg\":0.8}",
                "{\"boxSize\":\"medium\",\"weightKg\":0}",
                "{\"boxSize\":\"medium\",\"weightKg\":-1.5}",
                "{\"weightKg\":0.8}"}) {
            mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/pack",
                            FulfillmentTestSupport.WAREHOUSE, "T-ORD-BAD")
                            .header("Authorization", staffToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isUnprocessableEntity())
                    .andExpect(jsonPath("$.message").value("Enter a valid box size and weight."));
        }

        assertThat(orders.findById("T-ORD-BAD").orElseThrow().getStatus()).isEqualTo("picked");
    }

    @Test
    void packRecordsBoxAndMovesStatus() throws Exception {
        fixture.twoItemOrder("T-ORD-PK", OrderStatus.PICKED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/pack",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-PK")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"boxSize\":\"medium\",\"weightKg\":0.8}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true))
                .andExpect(jsonPath("$.status").value("packed"))
                // Pack returns no trackingId: the contract shows only ok + status.
                .andExpect(jsonPath("$.trackingId").doesNotExist());

        assertThat(orders.findById("T-ORD-PK").orElseThrow().getStatus()).isEqualTo("packed");

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup/{orderId}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-PK")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stage").value("ready_to_ship"))
                .andExpect(jsonPath("$.packing.boxSize").value("medium"))
                .andExpect(jsonPath("$.packing.weightKg").value(0.8))
                .andExpect(jsonPath("$.packing.packed").value(true));
    }

    @Test
    void doublePackReturns409() throws Exception {
        fixture.twoItemOrder("T-ORD-2P", OrderStatus.PICKED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/pack",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-2P")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"boxSize\":\"large\",\"weightKg\":2.5}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("packed"));

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/pack",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-2P")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"boxSize\":\"large\",\"weightKg\":2.5}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Order must be picked before packing."));
    }

    @Test
    void shipBeforePackingReturns409() throws Exception {
        fixture.twoItemOrder("T-ORD-SB9", OrderStatus.PICKED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/ship",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-SB9")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\":\"BlueDart\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Order must be packed before shipping."));
    }

    @Test
    void blankCarrierReturns422() throws Exception {
        fixture.twoItemOrder("T-ORD-BC", OrderStatus.PACKED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/ship",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-BC")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\":\"  \"}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Choose a carrier."));

        assertThat(orders.findById("T-ORD-BC").orElseThrow().getStatus()).isEqualTo("packed");
    }

    @Test
    void shipGeneratesUniqueWellFormedTrackingIdAndWritesNoMovement() throws Exception {
        fixture.twoItemOrder("T-ORD-S1", OrderStatus.PACKED);
        fixture.twoItemOrder("T-ORD-S2", OrderStatus.PACKED);

        String first = trackingIdOf("T-ORD-S1", "BlueDart");
        String second = trackingIdOf("T-ORD-S2", "BlueDart");

        assertThat(first).matches("^[A-Z]{2}-\\d+$");
        assertThat(second).matches("^[A-Z]{2}-\\d+$");
        assertThat(Set.of(first, second)).hasSize(2);

        // Ship must not move stock again: it already left at pick time.
        assertThat(movements.findByWarehouseIdOrderByAtDesc(FulfillmentTestSupport.WAREHOUSE)).isEmpty();
    }

    @Test
    void failedReshipLeavesTheOriginalTrackingIdInPlace() throws Exception {
        fixture.twoItemOrder("T-ORD-RE", OrderStatus.PACKED);
        String original = trackingIdOf("T-ORD-RE", "BlueDart");

        // A retry 409s on status, so the id the customer was shown must not be churned.
        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/ship",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-RE")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\":\"BlueDart\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup/{orderId}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-RE")
                        .header("Authorization", staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.outbound.trackingId").value(original))
                .andExpect(jsonPath("$.outbound.shipped").value(true));
    }

    @Test
    void doubleShipReturns409() throws Exception {
        fixture.twoItemOrder("T-ORD-2S", OrderStatus.PACKED);

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/ship",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-2S")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\":\"BlueDart\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/ship",
                        FulfillmentTestSupport.WAREHOUSE, "T-ORD-2S")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\":\"BlueDart\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Order must be packed before shipping."));
    }

    @Test
    void packupForAnotherWarehousesOrderIs404() throws Exception {
        fixture.order("T-ORD-FAR", FulfillmentTestSupport.OTHER_WAREHOUSE, OrderStatus.PACKED, null);

        mockMvc.perform(get("/api/warehouses/{warehouseId}/packup/{orderId}", FulfillmentTestSupport.WAREHOUSE, "T-ORD-FAR")
                        .header("Authorization", staffToken))
                .andExpect(status().isNotFound());
    }

    private String trackingIdOf(String orderId, String carrier) throws Exception {
        return mockMvc.perform(post("/api/warehouses/{warehouseId}/packup/{orderId}/ship",
                        FulfillmentTestSupport.WAREHOUSE, orderId)
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"carrier\":\"" + carrier + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("shipped"))
                .andExpect(jsonPath("$.trackingId").isNotEmpty())
                .andReturn()
                .getResponse()
                .getContentAsString()
                .replaceAll(".*\"trackingId\":\"([^\"]+)\".*", "$1");
    }
}
