package com.shopstack.warehouse.port.dto;

/**
 * One order line. {@code itemId} is the identity the Pickup screen toggles against, and it
 * is stable for the life of the order — it is <em>not</em> the SKU, because one SKU can
 * appear on several lines of the same order.
 */
public record OrderItemRecord(
        String itemId,
        String orderId,
        String sku,
        String productName,
        int qty
) {
}
