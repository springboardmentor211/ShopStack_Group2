package com.shopstack.warehouse.port;

import com.shopstack.common.enums.OrderStatus;
import com.shopstack.common.exception.ConflictException;
import com.shopstack.warehouse.port.dto.OrderItemRecord;
import com.shopstack.warehouse.port.dto.OrderRecord;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * The only path from the warehouse module to order data and order status. Defined by the
 * warehouse team, implemented by the order module.
 *
 * <p>Order Desk, Pickup, Packup and the dashboard all read and write {@code order.status}
 * through this port. That is deliberate: routing every transition through
 * {@link #advanceStatus} makes a divergent per-service status copy impossible rather than
 * merely discouraged (customer contract §7).
 *
 * <p>Two notes on shape, both driven by the wire contract:
 * <ul>
 *   <li>{@link #findOrders} returns a plain {@link List}, not a {@code Page}, because
 *       {@code GET /orders} responds with a bare JSON array — there is no envelope to carry
 *       a total count in.</li>
 *   <li>{@link #countDueToday} is retained from the Sprint-1 {@code OrderSummaryPort} so the
 *       dashboard's {@code dueToday} field keeps a single source.</li>
 * </ul>
 */
public interface OrderFulfillmentPort {

    /**
     * Orders for a warehouse, newest first, optionally filtered to one status.
     *
     * @param page     zero-based page index
     * @param pageSize rows per page, already clamped by the caller
     */
    List<OrderRecord> findOrders(String warehouseId, OrderStatus status, int page, int pageSize);

    /** Empty when the order does not exist <em>in this warehouse</em>. */
    Optional<OrderRecord> findOrder(String warehouseId, String orderId);

    List<OrderItemRecord> findItems(String warehouseId, String orderId);

    /**
     * Sets a future-or-today delivery date and moves {@code pending -> confirmed}.
     * Callers validate the date first so the 422 message stays theirs.
     */
    OrderRecord confirm(String warehouseId, String orderId, LocalDate deliveryDate);

    /** Moves an order to {@code cancelled}. Callers enforce which statuses may cancel. */
    OrderRecord cancel(String warehouseId, String orderId);

    /**
     * Compare-and-set on status: applies {@code to} only if the order is currently
     * {@code from}.
     *
     * @throws ConflictException if the status is no longer {@code from} — this is the race
     *                           guard, so two concurrent transitions cannot both win
     */
    OrderRecord advanceStatus(String warehouseId, String orderId, OrderStatus from, OrderStatus to);

    /** Supersedes {@code OrderSummaryPort.countByWarehouseAndStatus}. */
    Map<OrderStatus, Integer> countByStatus(String warehouseId);

    /** Retained from {@code OrderSummaryPort} for the dashboard's {@code dueToday}. */
    int countDueToday(String warehouseId);
}
