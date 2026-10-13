package com.shopstack.security.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
public class JwtUtil {

    public static final String CLAIM_WAREHOUSE_ID = JwtUtils.CLAIM_WAREHOUSE_ID;
    public static final String CLAIM_ROLE = JwtUtils.CLAIM_ROLE;

    private final JwtUtils jwtUtils;

    public JwtUtil(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    public Optional<Claims> parse(String token) {
        return jwtUtils.parse(token);
    }

    public String generate(String subject, Map<String, String> claims) {
        return jwtUtils.generate(subject, claims);
    }

    public long getExpiryMs() {
        return jwtUtils.getExpiryMs();
    }
}
