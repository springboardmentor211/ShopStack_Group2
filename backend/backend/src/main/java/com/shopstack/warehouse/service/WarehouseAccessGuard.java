package com.shopstack.warehouse.service;

import com.shopstack.security.jwt.JwtAuthenticationToken;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Enforces the contract §1 rule that a caller may only read the warehouse named in
 * the path. Without this, editing the id in the URL exposes another warehouse's data.
 */
@Component
public class WarehouseAccessGuard {

    public void requireAccess(String warehouseId) {
        String callerWarehouseId = callerWarehouseId();
        if (callerWarehouseId == null || !callerWarehouseId.equals(warehouseId)) {
            throw new AccessDeniedException("You do not have access to this warehouse.");
        }
    }

    public String callerWarehouseId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwt) {
            return jwt.getWarehouseId();
        }
        return null;
    }
}
