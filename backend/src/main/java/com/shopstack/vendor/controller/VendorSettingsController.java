
package com.shopstack.vendor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopstack.vendor.dto.VendorSettingsRequest;
import com.shopstack.vendor.dto.VendorSettingsResponse;
import com.shopstack.vendor.service.VendorSettingsService;

@RestController
@RequestMapping("/api/vendor/settings")
public class VendorSettingsController {

    private final VendorSettingsService service;

    public VendorSettingsController(VendorSettingsService service) {
        this.service = service;
    }

    @GetMapping
    public VendorSettingsResponse getSettings() {
        return service.getSettings();
    }

    @PutMapping
    public VendorSettingsResponse updateSettings(
            @RequestBody VendorSettingsRequest request) {
        return service.updateSettings(request);
    }
}
