package com.shopstack.warehouse;

import com.shopstack.security.jwt.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Map;
import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * W-21 · Every customer-side endpoint must refuse a caller whose token names a different
 * warehouse. Editing the id in the URL must not be enough to reach another warehouse's data.
 */
@SpringBootTest
@AutoConfigureMockMvc
class WarehouseScopeIntegrationTest {

    private static final String CALLER_WAREHOUSE = "WH-NORTH";
    private static final String VICTIM_WAREHOUSE = "WH-SOUTH";

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;

    private String callerToken;

    @BeforeEach
    void setUp() {
        callerToken = "Bearer " + jwtUtil.generate("maya@shopstack.dev", Map.of(
                JwtUtil.CLAIM_WAREHOUSE_ID, CALLER_WAREHOUSE,
                JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));
    }

    static Stream<Arguments> customerEndpoints() {
        return Stream.of(
                Arguments.of("GET /orders", get("/api/warehouses/{w}/orders", VICTIM_WAREHOUSE)),
                Arguments.of("GET /orders/{id}", get("/api/warehouses/{w}/orders/{id}", VICTIM_WAREHOUSE, "T-ORD-1")),
                Arguments.of("POST /orders/{id}/confirm",
                        post("/api/warehouses/{w}/orders/{id}/confirm", VICTIM_WAREHOUSE, "T-ORD-1")
                                .contentType(MediaType.APPLICATION_JSON)),
                Arguments.of("POST /orders/{id}/cancel",
                        post("/api/warehouses/{w}/orders/{id}/cancel", VICTIM_WAREHOUSE, "T-ORD-1")),
                Arguments.of("GET /pickup", get("/api/warehouses/{w}/pickup", VICTIM_WAREHOUSE)),
                Arguments.of("GET /pickup/{id}",
                        get("/api/warehouses/{w}/pickup/{id}", VICTIM_WAREHOUSE, "T-ORD-1")),
                Arguments.of("POST /pickup/{id}/item",
                        post("/api/warehouses/{w}/pickup/{id}/item", VICTIM_WAREHOUSE, "T-ORD-1")
                                .contentType(MediaType.APPLICATION_JSON)),
                Arguments.of("POST /pickup/{id}/complete",
                        post("/api/warehouses/{w}/pickup/{id}/complete", VICTIM_WAREHOUSE, "T-ORD-1")),
                Arguments.of("GET /packup", get("/api/warehouses/{w}/packup", VICTIM_WAREHOUSE)),
                Arguments.of("GET /packup/{id}",
                        get("/api/warehouses/{w}/packup/{id}", VICTIM_WAREHOUSE, "T-ORD-1")),
                Arguments.of("POST /packup/{id}/pack",
                        post("/api/warehouses/{w}/packup/{id}/pack", VICTIM_WAREHOUSE, "T-ORD-1")
                                .contentType(MediaType.APPLICATION_JSON)),
                Arguments.of("POST /packup/{id}/ship",
                        post("/api/warehouses/{w}/packup/{id}/ship", VICTIM_WAREHOUSE, "T-ORD-1")
                                .contentType(MediaType.APPLICATION_JSON))
        );
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("customerEndpoints")
    void validTokenForAnotherWarehouseIs403(String label, MockHttpServletRequestBuilder request) throws Exception {
        mockMvc.perform(request.header("Authorization", callerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
}
