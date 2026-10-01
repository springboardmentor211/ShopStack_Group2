package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.request.PackRequest;
import com.shopstack.warehouse.dto.request.ShipRequest;
import com.shopstack.warehouse.dto.response.ActionResultDto;
import com.shopstack.warehouse.dto.response.PackupDetailDto;
import com.shopstack.warehouse.dto.response.PackupListItemDto;
import com.shopstack.warehouse.service.PackupService;
import com.shopstack.warehouse.service.WarehouseAccessGuard;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Packup — customer contract §5. */
@RestController
@RequestMapping("/api/warehouses")
public class WarehousePackupController {

    private final PackupService packupService;
    private final WarehouseAccessGuard accessGuard;

    public WarehousePackupController(PackupService packupService,
                                     WarehouseAccessGuard accessGuard) {
        this.packupService = packupService;
        this.accessGuard = accessGuard;
    }

    @GetMapping("/{warehouseId}/packup")
    public List<PackupListItemDto> getQueue(@PathVariable String warehouseId,
                                            @RequestParam(required = false) String stage) {
        accessGuard.requireAccess(warehouseId);
        return packupService.getQueue(warehouseId, stage);
    }

    @GetMapping("/{warehouseId}/packup/{orderId}")
    public PackupDetailDto getDetail(@PathVariable String warehouseId,
                                     @PathVariable String orderId) {
        accessGuard.requireAccess(warehouseId);
        return packupService.getDetail(warehouseId, orderId);
    }

    @PostMapping("/{warehouseId}/packup/{orderId}/pack")
    public ActionResultDto pack(@PathVariable String warehouseId,
                                @PathVariable String orderId,
                                @RequestBody(required = false) PackRequest request) {
        accessGuard.requireAccess(warehouseId);
        return packupService.pack(warehouseId, orderId,
                request == null ? null : request.boxSize(),
                request == null ? null : request.weightKg());
    }

    @PostMapping("/{warehouseId}/packup/{orderId}/ship")
    public ActionResultDto ship(@PathVariable String warehouseId,
                                @PathVariable String orderId,
                                @RequestBody(required = false) ShipRequest request) {
        accessGuard.requireAccess(warehouseId);
        return packupService.ship(warehouseId, orderId,
                request == null ? null : request.carrier());
    }
}
