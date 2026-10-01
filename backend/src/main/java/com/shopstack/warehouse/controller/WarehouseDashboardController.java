package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.response.OrderSummaryDto;
import com.shopstack.warehouse.service.OrderSummaryService;
import com.shopstack.warehouse.service.WarehouseAccessGuard;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseDashboardController {

    private final OrderSummaryService orderSummaryService;
    private final WarehouseAccessGuard accessGuard;

    public WarehouseDashboardController(OrderSummaryService orderSummaryService,
                                         WarehouseAccessGuard accessGuard) {
        this.orderSummaryService = orderSummaryService;
        this.accessGuard = accessGuard;
    }

    @GetMapping("/{warehouseId}/orders/summary")
    public OrderSummaryDto getOrderSummary(@PathVariable String warehouseId) {
        accessGuard.requireAccess(warehouseId);
        return orderSummaryService.getSummary(warehouseId);
    }
}
