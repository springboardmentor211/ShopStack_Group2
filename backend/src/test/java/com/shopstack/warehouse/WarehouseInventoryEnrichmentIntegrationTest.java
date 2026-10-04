package com.shopstack.warehouse;

import com.shopstack.security.jwt.JwtUtil;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Contract §3.2: each inventory row must carry the catalogue product data plus the
 * resolved vendor display name, not the placeholder nulls returned before W-10.
 */
@SpringBootTest
@AutoConfigureMockMvc
class WarehouseInventoryEnrichmentIntegrationTest {

    private static final String WAREHOUSE = "WH-NORTH";

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private InventoryRowRepository inventoryRowRepository;

    private String staffToken;

    @BeforeEach
    void setUp() {
        staffToken = jwtUtil.generate("maya@shopstack.dev",
                Map.of(JwtUtil.CLAIM_WAREHOUSE_ID, WAREHOUSE, JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));
        inventoryRowRepository.deleteAllInBatch();
    }

    private String bearer() {
        return "Bearer " + staffToken;
    }

    @Test
    void inventoryResolvesProductAndVendorFromCatalogue() throws Exception {
        inventoryRowRepository.save(InventoryRow.builder()
                .warehouseId(WAREHOUSE)
                .sku("S360-SHO-005")
                .zone("B")
                .bin("B-02-03")
                .qty(6)
                .build());

        mockMvc.perform(get("/api/warehouses/{w}/inventory", WAREHOUSE)
                        .header("Authorization", bearer()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Urban Runner Sneakers"))
                .andExpect(jsonPath("$[0].variant").value("Grey · UK 8"))
                .andExpect(jsonPath("$[0].category").value("Fashion"))
                .andExpect(jsonPath("$[0].vendorId").value("VND-103"))
                .andExpect(jsonPath("$[0].vendor").value("Meridian Goods"))
                .andExpect(jsonPath("$[0].threshold").value(10));
    }

    @Test
    void unknownSkuFallsBackToDerivedNameWithoutVendor() throws Exception {
        inventoryRowRepository.save(InventoryRow.builder()
                .warehouseId(WAREHOUSE)
                .sku("S360-XYZ-999")
                .zone("A")
                .bin("A-01-01")
                .qty(4)
                .build());

        mockMvc.perform(get("/api/warehouses/{w}/inventory", WAREHOUSE)
                        .header("Authorization", bearer()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("XYZ 999"))
                .andExpect(jsonPath("$[0].category").value("Uncategorised"))
                .andExpect(jsonPath("$[0].vendorId").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$[0].vendor").value(org.hamcrest.Matchers.nullValue()));
    }
}
