package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.response.OrderSummaryDto;
import com.shopstack.warehouse.service.OrderSummaryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseDashboardController {

    private final OrderSummaryService orderSummaryService;

    public WarehouseDashboardController(OrderSummaryService orderSummaryService) {
        this.orderSummaryService = orderSummaryService;
    }

    @GetMapping("/{warehouseId}/orders/summary")
    public OrderSummaryDto getOrderSummary(@PathVariable String warehouseId) {
        return orderSummaryService.getSummary(warehouseId);
    }
}
