package com.shopstack.warehouse.service;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.common.exception.UnprocessableException;
import com.shopstack.warehouse.dto.response.OrderDetailDto;
import com.shopstack.warehouse.dto.response.OrderListItemDto;
import com.shopstack.warehouse.port.OrderFulfillmentPort;
import com.shopstack.warehouse.port.dto.OrderItemRecord;
import com.shopstack.warehouse.port.dto.OrderRecord;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Order Desk: the list and detail views, plus confirm and cancel.
 *
 * <p>All order data comes from {@link OrderFulfillmentPort}; this service never touches the
 * order module's tables. Status pre-conditions are checked here so the 409/422 messages are
 * the contract's, and the port re-checks them as a compare-and-set to close races.
 */
@Service
public class OrderDeskService {

    /** Contract cap on page size; a larger request is silently clamped, not rejected. */
    private static final int MAX_PAGE_SIZE = 100;

    /** Once an order is moving it can no longer be cancelled (contract §3.4). */
    private static final Set<OrderStatus> TOO_LATE_TO_CANCEL = Set.of(
            OrderStatus.SHIPPED,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLED);

    private final OrderFulfillmentPort orderFulfillmentPort;
    private final InventoryRowRepository inventoryRowRepository;

    public OrderDeskService(OrderFulfillmentPort orderFulfillmentPort,
                            InventoryRowRepository inventoryRowRepository) {
        this.orderFulfillmentPort = orderFulfillmentPort;
        this.inventoryRowRepository = inventoryRowRepository;
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
        return toDetail(orderFulfillmentPort.confirm(warehouseId, orderId, deliveryDate));
    }

    @Transactional
    public OrderDetailDto cancel(String warehouseId, String orderId) {
        OrderRecord order = requireOrder(warehouseId, orderId);
        if (TOO_LATE_TO_CANCEL.contains(order.status())) {
            throw new ConflictException("This order can no longer be cancelled.");
        }
        // No compensating stock movement: a completed pick already decremented
        // inventory_rows, so cancelling does not put anything back. Deliberate.
        return toDetail(orderFulfillmentPort.cancel(warehouseId, orderId));
    }

    /**
     * Reads the order or 404s. A valid order id belonging to another warehouse is also a
     * 404 rather than a 403, so this endpoint does not disclose which ids exist elsewhere.
     */
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

        // One read of the warehouse's stock, indexed by SKU, shared across all lines —
        // avoids an N+1 query when an order has several lines.
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

    /**
     * Reads bin location and stock from {@code inventory_rows} — the same table the vendor
     * Inventory screen reads — so the two screens cannot disagree about where a SKU sits.
     * Both fields are null when the warehouse stocks none of that SKU.
     */
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
