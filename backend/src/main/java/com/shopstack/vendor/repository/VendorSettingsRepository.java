
package com.shopstack.vendor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopstack.vendor.entity.VendorSettings;

public interface VendorSettingsRepository
        extends JpaRepository<VendorSettings, Long> {
}
