package com.shopstack.security;

import com.shopstack.security.jwt.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class WarehouseAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;

    private String token(String warehouseId, String role) {
        return "Bearer " + jwtUtil.generate("tester@shopstack.dev", Map.of(
                JwtUtil.CLAIM_WAREHOUSE_ID, warehouseId,
                JwtUtil.CLAIM_ROLE, role));
    }

    @Test
    void missingTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/warehouses/WH-NORTH/inventory"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void malformedTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/warehouses/WH-NORTH/inventory")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenSignedWithWrongSecretReturns401() throws Exception {
        JwtUtil other = new JwtUtil("a-completely-different-secret-of-sufficient-length", 60000);
        String foreign = other.generate("attacker@evil.dev", Map.of(
                JwtUtil.CLAIM_WAREHOUSE_ID, "WH-NORTH",
                JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));

        mockMvc.perform(get("/api/warehouses/WH-NORTH/inventory")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + foreign))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void expiredTokenReturns401() throws Exception {
        JwtUtil expired = new JwtUtil(
                System.getProperty("test.jwt.secret",
                        "dev-only-insecure-secret-at-least-32-bytes-long"), -1000);
        String stale = expired.generate("tester@shopstack.dev", Map.of(
                JwtUtil.CLAIM_WAREHOUSE_ID, "WH-NORTH",
                JwtUtil.CLAIM_ROLE, "WAREHOUSE_STAFF"));

        mockMvc.perform(get("/api/warehouses/WH-NORTH/inventory")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + stale))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validTokenForOwnWarehouseReturns200() throws Exception {
        mockMvc.perform(get("/api/warehouses/WH-NORTH/inventory")
                        .header(HttpHeaders.AUTHORIZATION, token("WH-NORTH", "WAREHOUSE_STAFF")))
                .andExpect(status().isOk());
    }

    @Test
    void accessingAnotherWarehouseReturns403() throws Exception {
        mockMvc.perform(get("/api/warehouses/WH-SOUTH/inventory")
                        .header(HttpHeaders.AUTHORIZATION, token("WH-NORTH", "WAREHOUSE_STAFF")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void wrongRoleReturns403() throws Exception {
        mockMvc.perform(get("/api/warehouses/WH-NORTH/inventory")
                        .header(HttpHeaders.AUTHORIZATION, token("WH-NORTH", "Customer")))
                .andExpect(status().isForbidden());
    }

    @Test
    void authMeReturnsProfileForValidToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, token("WH-NORTH", "WAREHOUSE_STAFF")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.warehouseId").value("WH-NORTH"))
                .andExpect(jsonPath("$.warehouseName").value("North Hub"))
                .andExpect(jsonPath("$.city").value("Pune"))
                .andExpect(jsonPath("$.ownerName").value("Maya Sharma"))
                .andExpect(jsonPath("$.role").value("Warehouse manager"));
    }

    @Test
    void authMeReturns401WithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
