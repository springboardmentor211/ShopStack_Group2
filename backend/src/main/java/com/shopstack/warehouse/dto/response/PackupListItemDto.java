package com.shopstack.warehouse.dto.response;

import com.shopstack.common.enums.PackStage;

/** One row of {@code GET /packup}. */
public record PackupListItemDto(
        String orderId,
        String warehouseId,
        PackStage stage,
        String customerName,
        int itemCount
) {
}
