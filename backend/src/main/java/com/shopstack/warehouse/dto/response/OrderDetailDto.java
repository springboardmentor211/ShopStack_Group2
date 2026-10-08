package com.shopstack.warehouse.dto.response;

import com.shopstack.common.enums.OrderStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Body of {@code GET /orders/{orderId}} and the 200 of confirm/cancel, so the frontend
 * re-renders from a single payload after an action.
 *
 * @param deliveryDate null until confirmed
 */
public record OrderDetailDto(
        String orderId,
        String warehouseId,
        OrderStatus status,
        LocalDate deliveryDate,
        Instant placedAt,
        CustomerDto customer,
        List<OrderItemDto> items
) {
    public record CustomerDto(
            String name,
            String phone,
            String addressLine,
            String city
    ) {
    }

    /**
     * @param binLocation  bin currently holding the SKU in this warehouse, or null if the
     *                     warehouse stocks none of it
     * @param stockOnHand  quantity in that bin, or null when there is no such row
     */
    public record OrderItemDto(
            String sku,
            String productName,
            String binLocation,
            int qty,
            Integer stockOnHand
    ) {
    }
}
