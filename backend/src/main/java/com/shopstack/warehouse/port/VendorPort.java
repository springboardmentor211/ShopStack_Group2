package com.shopstack.warehouse.port;

/**
 * Defined by the warehouse team, implemented by the vendor module (W-10).
 */
public interface VendorPort {

    VendorInfo findById(String vendorId);

    record VendorInfo(String name, String shop, String gstin, String contact, String phone) {}
}
