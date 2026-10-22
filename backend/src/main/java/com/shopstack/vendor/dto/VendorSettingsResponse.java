
package com.shopstack.vendor.dto;

import com.shopstack.vendor.entity.VendorSettings;

public record VendorSettingsResponse(
    Long id,
    boolean storeStatus,
    boolean orderNotifications,
    boolean lowStockAlerts,
    boolean newOrders,
    boolean orderUpdates,
    boolean lowStock,
    boolean warehouseUpdates
) {
    public static VendorSettingsResponse from(VendorSettings settings) {
        return new VendorSettingsResponse(
            settings.getId(),
            settings.isStoreStatus(),
            settings.isOrderNotifications(),
            settings.isLowStockAlerts(),
            settings.isNewOrders(),
            settings.isOrderUpdates(),
            settings.isLowStock(),
            settings.isWarehouseUpdates()
        );
    }
}
