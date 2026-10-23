package com.shopstack.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtUtils {

    public static final String CLAIM_WAREHOUSE_ID = "warehouseId";
    public static final String CLAIM_ROLE = "role";

    private final SecretKey key;
    private final long expiryMs;

    public JwtUtils() {
        this("ShopStackSuperSecretKeyForJwtTokenAuthentication2026", 604800000L);
    }

    @Autowired
    public JwtUtils(@Value("${app.jwt.secret:ShopStackSuperSecretKeyForJwtTokenAuthentication2026}") String secret,
                   @Value("${app.jwt.expiry-ms:${app.jwt.expiration-ms:604800000}}") long expiryMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiryMs = expiryMs;
    }

    private SecretKey getSigningKey() {
        return key;
    }

    public String generateJwtToken(String username) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(expiryMs)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public Optional<Claims> parse(String token) {
        try {
            return Optional.of(Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody());
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    /**
     * Used by tests and the local dev token endpoint. The auth team owns real issuance;
     * once a login flow exists this should be deleted along with its callers.
     */
    public String generate(String subject, Map<String, String> claims) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(expiryMs)));
        claims.forEach(builder::claim);
        return builder.signWith(key, SignatureAlgorithm.HS256).compact();
    }

    public long getExpiryMs() {
        return expiryMs;
    }
}