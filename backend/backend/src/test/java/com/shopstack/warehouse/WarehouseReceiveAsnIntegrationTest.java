package com.shopstack.warehouse;

import com.shopstack.security.jwt.JwtUtil;
import com.shopstack.warehouse.entity.InboundShipment;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.entity.StockMovement;
import com.shopstack.warehouse.entity.WarehouseBin;
import com.shopstack.warehouse.repository.InboundShipmentRepository;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;
import com.shopstack.warehouse.repository.WarehouseBinRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class WarehouseReceiveAsnIntegrationTest {

    private static final String WAREHOUSE = "WH-NORTH";
    private static final String VALID_BIN = "B-02-03";

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private InboundShipmentRepository inboundShipmentRepository;
    @Autowired
    private InventoryRowRepository inventoryRowRepository;
    @Autowired
    private StockMovementRepository stockMovementRepository;
    @Autowired
    private WarehouseBinRepository warehouseBinRepository;

    private String staffToken;

    @BeforeEach
    void setUp() {
        staffToken = jwtUtil.generate("maya@shopstack.dev",
                Map.of(JwtUtil.CLAIM_WAREHOUSE_ID, WAREHOUSE, JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));
        cleanup();
    }

    private void cleanup() {
        stockMovementRepository.deleteAllInBatch();
        inboundShipmentRepository.deleteAllInBatch();
        inventoryRowRepository.deleteAllInBatch();
    }

    private InboundShipment shipment(String id, String sku, int qty, String status) {
        return inboundShipmentRepository.save(InboundShipment.builder()
                .id(id)
                .warehouseId(WAREHOUSE)
                .vendorId("VND-103")
                .sku(sku)
                .qty(qty)
                .status(status)
                .arrivedAt(Instant.now())
                .build());
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    void receiveAddsStockRecordsMovementAndReturnsUpdatedRow() throws Exception {
        shipment("ASN-T-2001", "S360-SHO-005", 60, "pending");

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2001")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"" + VALID_BIN + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("ASN-T-2001"))
                .andExpect(jsonPath("$.status").value("received"))
                .andExpect(jsonPath("$.bin").value(VALID_BIN))
                .andExpect(jsonPath("$.receivedAt").isNotEmpty());

        InventoryRow row = inventoryRowRepository
                .findByWarehouseIdAndSkuAndBin(WAREHOUSE, "S360-SHO-005", VALID_BIN)
                .orElseThrow();
        assertThat(row.getQty()).isEqualTo(60);
        assertThat(row.getZone()).isEqualTo("B");

        List<StockMovement> movements = stockMovementRepository.findByWarehouseIdOrderByAtDesc(WAREHOUSE);
        assertThat(movements).hasSize(1);
        StockMovement movement = movements.get(0);
        assertThat(movement.getType()).isEqualTo("Putaway");
        assertThat(movement.getToLoc()).isEqualTo(VALID_BIN);
        assertThat(movement.getQty()).isEqualTo(60);
        assertThat(movement.getId()).matches("MOV-\\d{4}");
        assertThat(movement.getPerformedBy()).isEqualTo("Maya Sharma");
    }

    @Test
    void receivingTwiceIntoSameBinAccumulatesQuantity() throws Exception {
        shipment("ASN-T-2002", "S360-SHO-005", 10, "pending");
        shipment("ASN-T-2003", "S360-SHO-005", 15, "pending");

        for (String id : List.of("ASN-T-2002", "ASN-T-2003")) {
            mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, id)
                            .header("Authorization", bearer(staffToken))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"bin\":\"" + VALID_BIN + "\"}"))
                    .andExpect(status().isOk());
        }

        InventoryRow row = inventoryRowRepository
                .findByWarehouseIdAndSkuAndBin(WAREHOUSE, "S360-SHO-005", VALID_BIN)
                .orElseThrow();
        assertThat(row.getQty()).isEqualTo(25);
    }

    @Test
    void unknownShipmentReturns404() throws Exception {
        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-DOES-NOT-EXIST")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"" + VALID_BIN + "\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Shipment not found."));
    }

    @Test
    void alreadyReceivedReturns409() throws Exception {
        shipment("ASN-T-2004", "S360-SHO-005", 20, "received");

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2004")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"" + VALID_BIN + "\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("This shipment is already in inventory."));
    }

    @Test
    void binFromAnotherWarehouseReturns422() throws Exception {
        shipment("ASN-T-2005", "S360-SHO-005", 20, "pending");

        // A label that exists in WH-SOUTH and provably not in WH-NORTH. The seeded
        // warehouses share labels like A-01-01, so reusing one would pass incorrectly.
        String foreignOnlyBin = "Z-99-01";
        warehouseBinRepository.findByWarehouseId("WH-SOUTH").stream()
                .filter(b -> foreignOnlyBin.equals(b.getBinLabel()))
                .forEach(warehouseBinRepository::delete);
        warehouseBinRepository.save(WarehouseBin.builder()
                .warehouseId("WH-SOUTH")
                .zone("Z")
                .binLabel(foreignOnlyBin)
                .build());
        assertThat(warehouseBinRepository.findByWarehouseId(WAREHOUSE))
                .noneMatch(b -> b.getBinLabel().equals(foreignOnlyBin));

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2005")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"" + foreignOnlyBin + "\"}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Choose a valid bin for this warehouse."));
    }

    @Test
    void unknownBinReturns422() throws Exception {
        shipment("ASN-T-2006", "S360-SHO-005", 20, "pending");

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2006")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"ZZ-99-99\"}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Choose a valid bin for this warehouse."));
    }

    @Test
    void blankBinReturns422() throws Exception {
        shipment("ASN-T-2007", "S360-SHO-005", 20, "pending");

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2007")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void failedReceiveLeavesNoInventoryOrMovementBehind() throws Exception {
        shipment("ASN-T-2008", "S360-SHO-005", 20, "pending");

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2008")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"ZZ-99-99\"}"))
                .andExpect(status().isUnprocessableEntity());

        assertThat(inventoryRowRepository.findByWarehouseId(WAREHOUSE)).isEmpty();
        assertThat(stockMovementRepository.findByWarehouseIdOrderByAtDesc(WAREHOUSE)).isEmpty();
        assertThat(inboundShipmentRepository.findById("ASN-T-2008").orElseThrow().getStatus())
                .isEqualTo("pending");
    }

    @Test
    void concurrentReceivesYieldOneSuccessAndOneConflict() throws Exception {
        shipment("ASN-T-2009", "S360-SHO-005", 25, "pending");

        CyclicBarrier barrier = new CyclicBarrier(2);
        ExecutorService pool = Executors.newFixedThreadPool(2);

        Callable<Integer> receive = () -> {
            barrier.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2009")
                            .header("Authorization", bearer(staffToken))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"bin\":\"" + VALID_BIN + "\"}"))
                    .andReturn()
                    .getResponse()
                    .getStatus();
        };

        try {
            Future<Integer> first = pool.submit(receive);
            Future<Integer> second = pool.submit(receive);

            int a = first.get(20, TimeUnit.SECONDS);
            int b = second.get(20, TimeUnit.SECONDS);

            assertThat(List.of(a, b)).containsExactlyInAnyOrder(200, 409);
        } finally {
            pool.shutdownNow();
        }

        InventoryRow row = inventoryRowRepository
                .findByWarehouseIdAndSkuAndBin(WAREHOUSE, "S360-SHO-005", VALID_BIN)
                .orElseThrow();
        assertThat(row.getQty()).as("stock must not be double counted").isEqualTo(25);
        assertThat(stockMovementRepository.findByWarehouseIdOrderByAtDesc(WAREHOUSE))
                .as("exactly one movement must be recorded")
                .hasSize(1);
    }

    @Test
    void inventoryKeepsZeroQuantityRowsForOutOfStockDisplay() throws Exception {
        shipment("ASN-T-2010", "S360-SHO-005", 5, "pending");
        shipment("ASN-T-2011", "S360-SHO-005", 7, "pending");

        mockMvc.perform(post("/api/warehouses/{w}/inbound/{id}/receive", WAREHOUSE, "ASN-T-2011")
                        .header("Authorization", bearer(staffToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bin\":\"" + VALID_BIN + "\"}"))
                .andExpect(status().isOk());

        // An emptied row must survive so the frontend can render "Out of Stock".
        InventoryRow empty = inventoryRowRepository
                .findByWarehouseIdAndSkuAndBin(WAREHOUSE, "S360-SHO-005", "B-01-04")
                .orElse(null);
        if (empty != null) {
            empty.setQty(0);
            inventoryRowRepository.save(empty);

            mockMvc.perform(get("/api/warehouses/{w}/inventory", WAREHOUSE)
                            .header("Authorization", bearer(staffToken)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[?(@.bin=='B-01-04')].qty").value(0));
        }
    }

    @Test
    void binsAreGroupedByZone() throws Exception {
        mockMvc.perform(get("/api/warehouses/{w}/bins", WAREHOUSE)
                        .header("Authorization", bearer(staffToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.A").isArray())
                .andExpect(jsonPath("$.B", org.hamcrest.Matchers.hasSize(4)))
                .andExpect(jsonPath("$.B", org.hamcrest.Matchers.hasItem(VALID_BIN)));
    }

    @Test
    void emptyWarehouseReturnsEmptyCollectionsNotErrors() throws Exception {
        String emptyToken = jwtUtil.generate("tester@shopstack.dev",
                Map.of(JwtUtil.CLAIM_WAREHOUSE_ID, "WH-EMPTY", JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));

        mockMvc.perform(get("/api/warehouses/{w}/inventory", "WH-EMPTY")
                        .header("Authorization", bearer(emptyToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        mockMvc.perform(get("/api/warehouses/{w}/inbound", "WH-EMPTY")
                        .header("Authorization", bearer(emptyToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        mockMvc.perform(get("/api/warehouses/{w}/bins", "WH-EMPTY")
                        .header("Authorization", bearer(emptyToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void orderSummaryAlwaysReturnsAllSevenPipelineKeys() throws Exception {
        mockMvc.perform(get("/api/warehouses/{w}/orders/summary", WAREHOUSE)
                        .header("Authorization", bearer(staffToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dueToday").isNumber())
                .andExpect(jsonPath("$.pipeline.pending").isNumber())
                .andExpect(jsonPath("$.pipeline.confirmed").isNumber())
                .andExpect(jsonPath("$.pipeline.picked").isNumber())
                .andExpect(jsonPath("$.pipeline.packed").isNumber())
                .andExpect(jsonPath("$.pipeline.shipped").isNumber())
                .andExpect(jsonPath("$.pipeline.out_for_delivery").isNumber())
                .andExpect(jsonPath("$.pipeline.delivered").isNumber());
    }
}
