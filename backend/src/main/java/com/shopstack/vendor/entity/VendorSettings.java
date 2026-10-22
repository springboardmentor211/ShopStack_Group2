
package com.shopstack.vendor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vendor_settings")
public class VendorSettings {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private boolean storeStatus = true;

    @Column(nullable = false)
    private boolean orderNotifications = true;

    @Column(nullable = false)
    private boolean lowStockAlerts = true;

    @Column(nullable = false)
    private boolean newOrders = true;

    @Column(nullable = false)
    private boolean orderUpdates = true;

    @Column(nullable = false)
    private boolean lowStock = true;

    @Column(nullable = false)
    private boolean warehouseUpdates = true;

    public VendorSettings() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public boolean isStoreStatus() { return storeStatus; }
    public void setStoreStatus(boolean storeStatus) {
        this.storeStatus = storeStatus;
    }

    public boolean isOrderNotifications() { return orderNotifications; }
    public void setOrderNotifications(boolean orderNotifications) {
        this.orderNotifications = orderNotifications;
    }

    public boolean isLowStockAlerts() { return lowStockAlerts; }
    public void setLowStockAlerts(boolean lowStockAlerts) {
        this.lowStockAlerts = lowStockAlerts;
    }

    public boolean isNewOrders() { return newOrders; }
    public void setNewOrders(boolean newOrders) {
        this.newOrders = newOrders;
    }

    public boolean isOrderUpdates() { return orderUpdates; }
    public void setOrderUpdates(boolean orderUpdates) {
        this.orderUpdates = orderUpdates;
    }

    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) {
        this.lowStock = lowStock;
    }

    public boolean isWarehouseUpdates() { return warehouseUpdates; }
    public void setWarehouseUpdates(boolean warehouseUpdates) {
        this.warehouseUpdates = warehouseUpdates;
    }
}
