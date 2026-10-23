package com.shopstack.warehouse.dto.request;

/**
 * Body of {@code POST /pickup/{orderId}/item}.
 *
 * <p>Unannotated on purpose: missing fields are surfaced as a 422 by
 * {@code PickupService}, matching the contract's error shape.
 */
public record TogglePickRequest(
        String itemId,
        Boolean picked
) {
}
