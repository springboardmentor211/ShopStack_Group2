package com.shopstack.auth.controller;

import com.shopstack.security.jwt.JwtUtil;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Local development only: mints a token so the frontend and Postman can exercise the
 * API before the auth team's login flow exists.
 *
 * <p>This controller is only registered when app.jwt.dev-token-endpoint-enabled=true.
 * The bean does not exist otherwise, so the route 404s rather than merely refusing —
 * do not enable it anywhere reachable from a real user.
 */
@RestController
@RequestMapping("/api/auth")
@ConditionalOnProperty(name = "app.jwt.dev-token-endpoint-enabled", havingValue = "true")
public class DevTokenController {

    private final JwtUtil jwtUtil;

    public DevTokenController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/dev-token")
    public Map<String, Object> devToken(@RequestParam String warehouseId,
                                        @RequestParam(defaultValue = "WAREHOUSE_STAFF") String role,
                                        @RequestParam(defaultValue = "dev@shopstack.local") String subject) {
        Map<String, String> claims = new HashMap<>();
        claims.put(JwtUtil.CLAIM_WAREHOUSE_ID, warehouseId);
        claims.put(JwtUtil.CLAIM_ROLE, role);

        String token = jwtUtil.generate(subject, claims);

        Map<String, Object> body = new HashMap<>();
        body.put("accessToken", token);
        body.put("tokenType", "Bearer");
        body.put("expiresInMs", jwtUtil.getExpiryMs());
        return body;
    }
}
