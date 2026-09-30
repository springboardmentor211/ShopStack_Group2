package com.shopstack.warehouse.port;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Sprint 1 stub. The vendor module has no table yet, so display names fall back to
 * the vendor id.
 *
 * <p>W-10 removes this class in favour of the real vendor-module implementation.
 * Set {@code shopstack.warehouse.stub-ports=false} to disable it earlier.
 */
@Component
@ConditionalOnProperty(name = "shopstack.warehouse.stub-ports", havingValue = "true", matchIfMissing = true)
public class StubVendorPort implements VendorPort {

    @Override
    public VendorInfo findById(String vendorId) {
        if (vendorId == null || vendorId.isBlank()) {
            return null;
        }
        return new VendorInfo(vendorId, null, null, null, null);
    }
}
