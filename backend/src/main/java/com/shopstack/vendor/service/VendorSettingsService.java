
package com.shopstack.vendor.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopstack.vendor.dto.VendorSettingsRequest;
import com.shopstack.vendor.dto.VendorSettingsResponse;
import com.shopstack.vendor.entity.VendorSettings;
import com.shopstack.vendor.repository.VendorSettingsRepository;

@Service
@Transactional
public class VendorSettingsService {

    private static final long SETTINGS_ID = 1L;

    private final VendorSettingsRepository repository;

    public VendorSettingsService(VendorSettingsRepository repository) {
        this.repository = repository;
    }

    public VendorSettingsResponse getSettings() {
        VendorSettings settings = repository.findById(SETTINGS_ID)
            .orElseGet(this::createDefaultSettings);

        return VendorSettingsResponse.from(settings);
    }

    public VendorSettingsResponse updateSettings(
            VendorSettingsRequest request) {

        VendorSettings settings = repository.findById(SETTINGS_ID)
            .orElseGet(VendorSettings::new);

        settings.setId(SETTINGS_ID);
        settings.setStoreStatus(request.storeStatus());
        settings.setOrderNotifications(request.orderNotifications());
        settings.setLowStockAlerts(request.lowStockAlerts());
        settings.setNewOrders(request.newOrders());
        settings.setOrderUpdates(request.orderUpdates());
        settings.setLowStock(request.lowStock());
        settings.setWarehouseUpdates(request.warehouseUpdates());

        VendorSettings saved = repository.save(settings);

        return VendorSettingsResponse.from(saved);
    }

    private VendorSettings createDefaultSettings() {
        return repository.save(new VendorSettings());
    }
}
