package com.shopstack.warehouse.dto.response;

import com.shopstack.common.enums.PickStage;

/**
 * One row of {@code GET /pickup}. {@code stage} is {@code to_pick} for confirmed orders
 * and {@code picked} for picked ones; the query-only {@code all} value is never emitted.
 */
public record PickupListItemDto(
        String orderId,
        String warehouseId,
        PickStage stage,
        String customerName,
        int itemCount,
        String binSummary
) {
}
