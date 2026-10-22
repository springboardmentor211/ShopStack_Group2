
package com.shopstack.vendor.dto;

public record VendorSettingsRequest(
    boolean storeStatus,
    boolean orderNotifications,
    boolean lowStockAlerts,
    boolean newOrders,
    boolean orderUpdates,
    boolean lowStock,
    boolean warehouseUpdates
) {
}
