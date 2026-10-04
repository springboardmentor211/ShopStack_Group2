package com.shopstack.warehouse.service;

import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.warehouse.entity.Warehouse;
import com.shopstack.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public Optional<Warehouse> findById(String warehouseId) {
        return warehouseRepository.findById(warehouseId);
    }

    public Warehouse requireById(String warehouseId) {
        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));
    }
}
