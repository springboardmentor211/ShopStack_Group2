package com.shopstack.warehouse.dto.request;

/**
 * Body of {@code POST /packup/{orderId}/ship}.
 *
 * <p>Unannotated on purpose: the contract wants 422 "Choose a carrier." for a blank
 * carrier, not the 400 bean validation would produce. Validated in {@code PackupService}.
 */
public record ShipRequest(
        String carrier
) {
}
