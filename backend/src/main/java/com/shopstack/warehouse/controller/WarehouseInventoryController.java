package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.response.InventoryRowDto;
import com.shopstack.warehouse.dto.response.StockMovementDto;
import com.shopstack.warehouse.service.InventoryService;
import com.shopstack.warehouse.service.MovementService;
import com.shopstack.warehouse.service.WarehouseAccessGuard;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseInventoryController {

    private final InventoryService inventoryService;
    private final MovementService movementService;
    private final WarehouseAccessGuard accessGuard;

    public WarehouseInventoryController(InventoryService inventoryService,
                                        MovementService movementService,
                                        WarehouseAccessGuard accessGuard) {
        this.inventoryService = inventoryService;
        this.movementService = movementService;
        this.accessGuard = accessGuard;
    }

    @GetMapping("/{warehouseId}/inventory")
    public List<InventoryRowDto> getInventory(@PathVariable String warehouseId) {
        accessGuard.requireAccess(warehouseId);
        return inventoryService.getInventory(warehouseId);
    }

    @GetMapping("/{warehouseId}/bins")
    public Map<String, List<String>> getBins(@PathVariable String warehouseId) {
        accessGuard.requireAccess(warehouseId);
        return inventoryService.getBins(warehouseId);
    }

    @GetMapping("/{warehouseId}/movements")
    public List<StockMovementDto> getMovements(@PathVariable String warehouseId) {
        accessGuard.requireAccess(warehouseId);
        return movementService.getMovements(warehouseId);
    }
}