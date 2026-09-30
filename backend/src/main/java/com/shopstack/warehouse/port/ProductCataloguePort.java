package com.shopstack.warehouse.port;

/**
 * Defined by the warehouse team, implemented by the product module (W-10).
 * Keeps the warehouse module free of direct product-module imports.
 */
public interface ProductCataloguePort {

    ProductInfo findBySku(String sku);

    record ProductInfo(String name, String variant, String category, String imageUrl, Integer threshold) {}
}
