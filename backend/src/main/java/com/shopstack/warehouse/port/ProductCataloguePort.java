package com.shopstack.warehouse.port;

/**
 * Defined by the warehouse team, implemented by the product module (W-10).
 * Keeps the warehouse module free of direct product-module imports.
 */
public interface ProductCataloguePort {

    ProductInfo findBySku(String sku);

    /**
     * {@code vendorId} lets the warehouse module resolve the vendor display name
     * through {@link VendorPort} without importing the product module.
     */
    record ProductInfo(String name, String variant, String category, String vendorId,
                       Integer threshold, String imageUrl) {}
}
