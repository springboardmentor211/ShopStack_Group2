package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.response.InventoryRowDto;
import com.shopstack.warehouse.service.InventoryService;
import com.shopstack.warehouse.service.MovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseInventoryController {

    private final InventoryService inventoryService;
    private final MovementService movementService;

    public WarehouseInventoryController(InventoryService inventoryService, MovementService movementService) {
        this.inventoryService = inventoryService;
        this.movementService = movementService;
    }

    @GetMapping("/{warehouseId}/inventory")
    public List<InventoryRowDto> getInventory(@PathVariable String warehouseId) {
        return inventoryService.getInventory(warehouseId);
    }

    @GetMapping("/{warehouseId}/bins")
    public Map<String, List<String>> getBins(@PathVariable String warehouseId) {
        return inventoryService.getBins(warehouseId);
    }

    @GetMapping("/{warehouseId}/movements")
    public List<com.shopstack.warehouse.dto.response.StockMovementDto> getMovements(@PathVariable String warehouseId) {
        return movementService.getMovements(warehouseId);
    }
}