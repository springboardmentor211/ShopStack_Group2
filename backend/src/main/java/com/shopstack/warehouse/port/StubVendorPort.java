package com.shopstack.warehouse.port;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Sprint 1 stub. The vendor module has no table yet, so a small in-memory table
 * mirroring {@code frontend/src/warehouse/mocks/vendorsMock.js} is used so display
 * names and details are non-null. Unknown vendor ids fall back to the id itself.
 *
 * <p>W-10 removes this class in favour of the real vendor-module implementation.
 * Set {@code shopstack.warehouse.stub-ports=false} to disable it earlier.
 */
@Component
@ConditionalOnProperty(name = "shopstack.warehouse.stub-ports", havingValue = "true", matchIfMissing = true)
public class StubVendorPort implements VendorPort {

    private static final Map<String, VendorInfo> VENDORS = Map.of(
            "VND-101", new VendorInfo("Abhijeet Enterprises", "Abhijeet Enterprises", "27ABCDE1234F1Z5",
                    "Abhijeet", "+91 98765 43210"),
            "VND-102", new VendorInfo("Nordic Works", "Nordic Works India LLP", "29AACCN5678L1ZQ",
                    "Sara Lindqvist", "+91 90040 88213"),
            "VND-103", new VendorInfo("Meridian Goods", "Meridian Goods Pvt. Ltd.", "27AAJCM1234K1Z9",
                    "Rohit Malhotra", "+91 98202 11456"),
            "VND-104", new VendorInfo("Coastal Supply", "Coastal Supply Traders", "33AAECC9988N1ZR",
                    "Meera Iyer", "+91 93800 12245"),
            "VND-105", new VendorInfo("Sahyadri Textiles", "Sahyadri Textiles & Exports", "27AAKCS7788P1ZT",
                    "Vandana Kulkarni", "+91 98220 61780"),
            "VND-106", new VendorInfo("Kaveri Crafts", "Kaveri Crafts Collective", "29AAHCK2345Q1Z2",
                    "Arvind Rao", "+91 94480 30215")
    );

    @Override
    public VendorInfo findById(String vendorId) {
        if (vendorId == null || vendorId.isBlank()) {
            return null;
        }
        return VENDORS.getOrDefault(vendorId, new VendorInfo(vendorId, null, null, null, null));
    }
}
