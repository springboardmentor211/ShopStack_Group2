package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.request.TogglePickRequest;
import com.shopstack.warehouse.dto.response.ActionResultDto;
import com.shopstack.warehouse.dto.response.PickListDto;
import com.shopstack.warehouse.dto.response.PickupListItemDto;
import com.shopstack.warehouse.service.PickupService;
import com.shopstack.warehouse.service.WarehouseAccessGuard;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Pickup — customer contract §4. */
@RestController
@RequestMapping("/api/warehouses")
public class WarehousePickupController {

    private final PickupService pickupService;
    private final WarehouseAccessGuard accessGuard;

    public WarehousePickupController(PickupService pickupService,
                                     WarehouseAccessGuard accessGuard) {
        this.pickupService = pickupService;
        this.accessGuard = accessGuard;
    }

    @GetMapping("/{warehouseId}/pickup")
    public List<PickupListItemDto> getQueue(@PathVariable String warehouseId,
                                            @RequestParam(required = false) String stage) {
        accessGuard.requireAccess(warehouseId);
        return pickupService.getQueue(warehouseId, stage);
    }

    @GetMapping("/{warehouseId}/pickup/{orderId}")
    public PickListDto getPickList(@PathVariable String warehouseId,
                                   @PathVariable String orderId) {
        accessGuard.requireAccess(warehouseId);
        return pickupService.getPickList(warehouseId, orderId);
    }

    @PostMapping("/{warehouseId}/pickup/{orderId}/item")
    public ActionResultDto toggleItem(@PathVariable String warehouseId,
                                      @PathVariable String orderId,
                                      @RequestBody(required = false) TogglePickRequest request) {
        accessGuard.requireAccess(warehouseId);
        return pickupService.toggleItem(warehouseId, orderId,
                request == null ? null : request.itemId(),
                request == null ? null : request.picked());
    }

    @PostMapping("/{warehouseId}/pickup/{orderId}/complete")
    public ActionResultDto complete(@PathVariable String warehouseId,
                                    @PathVariable String orderId) {
        accessGuard.requireAccess(warehouseId);
        return pickupService.complete(warehouseId, orderId);
    }
}
