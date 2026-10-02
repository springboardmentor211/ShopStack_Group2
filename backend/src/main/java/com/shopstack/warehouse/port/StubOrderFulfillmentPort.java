package com.shopstack.warehouse.port;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.warehouse.dev.DevOrder;
import com.shopstack.warehouse.dev.DevOrderItem;
import com.shopstack.warehouse.dev.DevOrderItemRepository;
import com.shopstack.warehouse.dev.DevOrderRepository;
import com.shopstack.warehouse.port.dto.OrderItemRecord;
import com.shopstack.warehouse.port.dto.OrderRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Sprint 3 stub of {@link OrderFulfillmentPort}, backed by the {@code dev_orders} /
 * {@code dev_order_items} tables from V5. It exists because the order module is still
 * empty; the customer-side screens need real rows to page, filter and transition.
 *
 * <p>The order team replaces this with a real implementation. Because every caller depends
 * only on {@link OrderFulfillmentPort}, that swap is confined to this package.
 *
 * <p>Set {@code shopstack.warehouse.stub-ports=false} to remove it. Note that with the stub
 * disabled and no real implementation present, the context will fail to start — that is
 * deliberate, since a silently absent port would surface as 500s at runtime instead.
 */
@Component
@ConditionalOnProperty(name = "shopstack.warehouse.stub-ports", havingValue = "true", matchIfMissing = true)
public class StubOrderFulfillmentPort implements OrderFulfillmentPort {

    private static final String NOT_FOUND = "Order not found.";

    private final DevOrderRepository orderRepository;
    private final DevOrderItemRepository itemRepository;

    public StubOrderFulfillmentPort(DevOrderRepository orderRepository,
                                    DevOrderItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderRecord> findOrders(String warehouseId, OrderStatus status, int page, int pageSize) {
        List<DevOrder> orders = status == null
                ? orderRepository.findByWarehouseIdOrderByPlacedAtDesc(warehouseId)
                : orderRepository.findByWarehouseIdAndStatusOrderByPlacedAtDesc(warehouseId, status.wireValue());
        return pageOf(orders, page, pageSize).stream().map(this::toRecord).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderRecord> findOrder(String warehouseId, String orderId) {
        return orderRepository.findByIdAndWarehouseId(orderId, warehouseId).map(this::toRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemRecord> findItems(String warehouseId, String orderId) {
        return itemRepository.findByOrderIdOrderByItemId(orderId).stream()
                .map(i -> new OrderItemRecord(i.getItemId(), i.getOrderId(), i.getSku(),
                        i.getProductName(), i.getQty()))
                .toList();
    }

    @Override
    @Transactional
    public OrderRecord confirm(String warehouseId, String orderId, LocalDate deliveryDate) {
        DevOrder order = requireOrder(warehouseId, orderId);
        if (!OrderStatus.PENDING.wireValue().equals(order.getStatus())) {
            throw new ConflictException("This order has already been confirmed or cancelled.");
        }
        order.setStatus(OrderStatus.CONFIRMED.wireValue());
        order.setDeliveryDate(deliveryDate);
        return toRecord(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderRecord cancel(String warehouseId, String orderId) {
        DevOrder order = requireOrder(warehouseId, orderId);
        order.setStatus(OrderStatus.CANCELLED.wireValue());
        return toRecord(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderRecord advanceStatus(String warehouseId, String orderId, OrderStatus from, OrderStatus to) {
        DevOrder order = requireOrder(warehouseId, orderId);
        if (!from.wireValue().equals(order.getStatus())) {
            throw new ConflictException("This order is no longer " + from.wireValue() + ".");
        }
        order.setStatus(to.wireValue());
        return toRecord(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<OrderStatus, Integer> countByStatus(String warehouseId) {
        Map<OrderStatus, Integer> counts = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            counts.put(status, Math.toIntExact(
                    orderRepository.countByWarehouseIdAndStatus(warehouseId, status.wireValue())));
        }
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public int countDueToday(String warehouseId) {
        return (int) orderRepository.countByWarehouseIdAndDeliveryDate(warehouseId, LocalDate.now());
    }

    private DevOrder requireOrder(String warehouseId, String orderId) {
        return orderRepository.findByIdAndWarehouseId(orderId, warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException(NOT_FOUND));
    }

    private <T> List<T> pageOf(List<T> all, int page, int pageSize) {
        if (page < 0 || pageSize <= 0) {
            return List.of();
        }
        long from = (long) page * pageSize;
        if (from >= all.size()) {
            return List.of();
        }
        return all.subList((int) from, (int) Math.min(from + pageSize, all.size()));
    }

    private OrderRecord toRecord(DevOrder order) {
        return new OrderRecord(
                order.getId(),
                order.getWarehouseId(),
                OrderStatus.fromWire(order.getStatus()).orElseThrow(
                        () -> new IllegalStateException("Unknown order status in dev_orders: " + order.getStatus())),
                order.getDeliveryDate(),
                order.getPlacedAt(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getAddressLine(),
                order.getCity(),
                itemRepository.countByOrderId(order.getId())
        );
    }
}
