package com.shopstack.security.jwt;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

/**
 * Carries the warehouse context from the JWT so controllers and services can enforce
 * the per-warehouse authorization rule without re-parsing the token.
 */
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final String subject;
    private final String warehouseId;
    private final String role;

    public JwtAuthenticationToken(String subject, String warehouseId, String role,
                                  Collection<SimpleGrantedAuthority> authorities) {
        super(authorities);
        this.subject = subject;
        this.warehouseId = warehouseId;
        this.role = role;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return subject;
    }

    public String getSubject() {
        return subject;
    }

    public String getWarehouseId() {
        return warehouseId;
    }

    public String getRole() {
        return role;
    }

    public static List<SimpleGrantedAuthority> authoritiesFor(String role) {
        String normalised = role == null ? "" : role.trim().toUpperCase().replace(' ', '_');
        return List.of(new SimpleGrantedAuthority("ROLE_" + normalised));
    }
}