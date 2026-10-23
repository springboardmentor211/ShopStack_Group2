package com.shopstack.warehouse.dto.response;

import com.shopstack.common.enums.PackStage;

/**
 * Body of {@code GET /packup/{orderId}}. {@code packing} and {@code outbound} are always
 * present, carrying nulls before the corresponding step, so the frontend never has to guard
 * against a missing object.
 */
public record PackupDetailDto(
        String orderId,
        String warehouseId,
        PackStage stage,
        PackingDto packing,
        OutboundDto outbound
) {
    public record PackingDto(
            String boxSize,
            Double weightKg,
            boolean packed
    ) {
    }

    public record OutboundDto(
            String carrier,
            String trackingId,
            boolean shipped
    ) {
    }
}
