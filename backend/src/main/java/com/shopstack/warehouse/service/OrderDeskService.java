package com.shopstack.warehouse.service;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.common.exception.UnprocessableException;
import com.shopstack.common.util.IdGenerator;
import com.shopstack.warehouse.dto.response.OrderDetailDto;
import com.shopstack.warehouse.dto.response.OrderListItemDto;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.entity.StockMovement;
import com.shopstack.warehouse.port.OrderFulfillmentPort;
import com.shopstack.warehouse.port.dto.OrderItemRecord;
import com.shopstack.warehouse.port.dto.OrderRecord;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderDeskService {

    private static final int MAX_PAGE_SIZE = 100;

    private static final Set<OrderStatus> TOO_LATE_TO_CANCEL = Set.of(
            OrderStatus.SHIPPED,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLED);

    private final OrderFulfillmentPort orderFulfillmentPort;
    private final InventoryRowRepository inventoryRowRepository;
    private final StockMovementRepository stockMovementRepository;
    private final IdGenerator idGenerator;

    public OrderDeskService(OrderFulfillmentPort orderFulfillmentPort,
                            InventoryRowRepository inventoryRowRepository,
                            StockMovementRepository stockMovementRepository,
                            IdGenerator idGenerator) {
        this.orderFulfillmentPort = orderFulfillmentPort;
        this.inventoryRowRepository = inventoryRowRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.idGenerator = idGenerator;
    }

    @Transactional(readOnly = true)
    public List<OrderListItemDto> getOrders(String warehouseId, String statusFilter, int page, int pageSize) {
        OrderStatus status = parseStatusFilter(statusFilter);
        int clampedSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
        int clampedPage = Math.max(page, 0);
        return orderFulfillmentPort.findOrders(warehouseId, status, clampedPage, clampedSize).stream()
                .map(r -> new OrderListItemDto(
                        r.orderId(), r.warehouseId(), r.status(), r.customerName(),
                        r.city(), r.itemCount(), r.deliveryDate(), r.placedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderDetailDto getOrder(String warehouseId, String orderId) {
        return toDetail(requireOrder(warehouseId, orderId));
    }

    @Transactional
    public OrderDetailDto confirm(String warehouseId, String orderId, LocalDate deliveryDate) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (order.status() != OrderStatus.PENDING) {
            throw new ConflictException("This order has already been confirmed or cancelled.");
        }
        if (deliveryDate == null) {
            throw new UnprocessableException("Choose a valid delivery date.");
        }
        if (deliveryDate.isBefore(LocalDate.now())) {
            throw new UnprocessableException("Choose a valid delivery date.");
        }
        OrderRecord confirmed = orderFulfillmentPort.confirm(warehouseId, orderId, deliveryDate);
        logOrderMovement(warehouseId, orderId, "Confirmed", "Order desk", orderId + " · Pick queue");
        return toDetail(confirmed);
    }

    @Transactional
    public OrderDetailDto cancel(String warehouseId, String orderId) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (TOO_LATE_TO_CANCEL.contains(order.status())) {
            throw new ConflictException("This order can no longer be cancelled.");
        }
        OrderRecord cancelled = orderFulfillmentPort.cancel(warehouseId, orderId);
        logOrderMovement(warehouseId, orderId, "Cancelled", orderId, "Cancelled");
        return toDetail(cancelled);
    }

    private void logOrderMovement(String warehouseId, String orderId, String type, String from, String to) {
        String performedBy = currentUser();
        for (OrderItemRecord item : orderFulfillmentPort.findItems(warehouseId, orderId)) {
            stockMovementRepository.save(StockMovement.builder()
                    .id(idGenerator.generateMovementId())
                    .warehouseId(warehouseId)
                    .sku(item.sku())
                    .type(type)
                    .fromLoc(from)
                    .toLoc(to)
                    .qty(item.qty())
                    .performedBy(performedBy)
                    .at(Instant.now())
                    .build());
        }
    }

    private String currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : authentication.getName();
    }

    private OrderRecord requireOrder(String warehouseId, String orderId) {
        return orderFulfillmentPort.findOrder(warehouseId, orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
    }

    private OrderStatus parseStatusFilter(String filter) {
        if (filter == null || filter.isBlank() || "all".equalsIgnoreCase(filter.trim())) {
            return null;
        }
        return OrderStatus.fromWire(filter)
                .orElseThrow(() -> new UnprocessableException("Unknown status filter: " + filter));
    }

    private OrderDetailDto toDetail(OrderRecord order) {
        String warehouseId = order.warehouseId();

        Map<String, InventoryRow> stockBySku = inventoryRowRepository.findByWarehouseId(warehouseId).stream()
                .collect(Collectors.toMap(InventoryRow::getSku, r -> r, (a, b) -> a));

        List<OrderDetailDto.OrderItemDto> items = orderFulfillmentPort
                .findItems(warehouseId, order.orderId()).stream()
                .map(item -> toItemDto(item, stockBySku))
                .toList();

        return new OrderDetailDto(
                order.orderId(),
                warehouseId,
                order.status(),
                order.deliveryDate(),
                order.placedAt(),
                new OrderDetailDto.CustomerDto(
                        order.customerName(), order.customerPhone(), order.addressLine(), order.city()),
                items);
    }

    private OrderDetailDto.OrderItemDto toItemDto(OrderItemRecord item, Map<String, InventoryRow> stockBySku) {
        InventoryRow row = stockBySku.get(item.sku());
        return new OrderDetailDto.OrderItemDto(
                item.sku(),
                item.productName(),
                row == null ? null : row.getBin(),
                item.qty(),
                row == null ? null : row.getQty());
    }
}