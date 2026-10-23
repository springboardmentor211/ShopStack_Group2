package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.request.ConfirmOrderRequest;
import com.shopstack.warehouse.dto.response.OrderDetailDto;
import com.shopstack.warehouse.dto.response.OrderListItemDto;
import com.shopstack.warehouse.service.OrderDeskService;
import com.shopstack.warehouse.service.WarehouseAccessGuard;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Order Desk — customer contract §3. */
@RestController
@RequestMapping("/api/warehouses")
public class WarehouseOrderDeskController {

    private final OrderDeskService orderDeskService;
    private final WarehouseAccessGuard accessGuard;

    public WarehouseOrderDeskController(OrderDeskService orderDeskService,
                                        WarehouseAccessGuard accessGuard) {
        this.orderDeskService = orderDeskService;
        this.accessGuard = accessGuard;
    }

    @GetMapping("/{warehouseId}/orders")
    public List<OrderListItemDto> getOrders(@PathVariable String warehouseId,
                                            @RequestParam(required = false) String status,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int pageSize) {
        accessGuard.requireAccess(warehouseId);
        return orderDeskService.getOrders(warehouseId, status, page, pageSize);
    }

    @GetMapping("/{warehouseId}/orders/{orderId}")
    public OrderDetailDto getOrder(@PathVariable String warehouseId,
                                   @PathVariable String orderId) {
        accessGuard.requireAccess(warehouseId);
        return orderDeskService.getOrder(warehouseId, orderId);
    }

    @PostMapping("/{warehouseId}/orders/{orderId}/confirm")
    public OrderDetailDto confirm(@PathVariable String warehouseId,
                                  @PathVariable String orderId,
                                  @RequestBody(required = false) ConfirmOrderRequest request) {
        accessGuard.requireAccess(warehouseId);
        return orderDeskService.confirm(warehouseId, orderId,
                request == null ? null : request.deliveryDate());
    }

    @PostMapping("/{warehouseId}/orders/{orderId}/cancel")
    public OrderDetailDto cancel(@PathVariable String warehouseId,
                                 @PathVariable String orderId) {
        accessGuard.requireAccess(warehouseId);
        return orderDeskService.cancel(warehouseId, orderId);
    }
}
