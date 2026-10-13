package com.shopstack.warehouse.port.dto;

import com.shopstack.common.enums.OrderStatus;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Order header as the warehouse module needs to see it. Defined by the warehouse team,
 * produced by the order module.
 *
 * <p>The customer snapshot is carried inline (rather than resolved through a customer port)
 * because Order Desk renders name/city in a list and the full address in a detail view, and
 * every one of those fields comes from the same order read.
 *
 * @param itemCount number of order lines; denormalised so list views need no second query
 */
public record OrderRecord(
        String orderId,
        String warehouseId,
        OrderStatus status,
        LocalDate deliveryDate,
        Instant placedAt,
        String customerName,
        String customerPhone,
        String addressLine,
        String city,
        int itemCount
) {
}
