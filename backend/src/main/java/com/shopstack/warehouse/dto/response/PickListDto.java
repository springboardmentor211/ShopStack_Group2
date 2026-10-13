package com.shopstack.warehouse.dto.response;

import com.shopstack.common.enums.PickStage;

import java.util.List;

/** Body of {@code GET /pickup/{orderId}}. */
public record PickListDto(
        String orderId,
        String warehouseId,
        PickStage stage,
        List<PickListItemDto> pickList
) {
    public record PickListItemDto(
            String itemId,
            String sku,
            String productName,
            String binLocation,
            int qty,
            boolean picked
    ) {
    }
}
