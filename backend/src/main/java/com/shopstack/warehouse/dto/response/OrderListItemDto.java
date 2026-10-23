package com.shopstack.warehouse.dto.response;

import com.shopstack.common.enums.OrderStatus;

import java.time.Instant;
import java.time.LocalDate;

/**
 * One row of {@code GET /orders}. {@code status} serialises lower-case because
 * {@link OrderStatus} carries a {@code @JsonValue} wire form.
 *
 * @param deliveryDate null until the order is confirmed
 */
public record OrderListItemDto(
        String orderId,
        String warehouseId,
        OrderStatus status,
        String customerName,
        String city,
        int itemCount,
        LocalDate deliveryDate,
        Instant placedAt
) {
}
