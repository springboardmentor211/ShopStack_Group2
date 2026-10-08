package com.shopstack.warehouse.dto.request;

/**
 * Body of {@code POST /packup/{orderId}/pack}.
 *
 * <p>Unannotated on purpose: the contract wants 422 "Enter a valid box size and weight."
 * for a bad size or weight, not the 400 bean validation would produce. Validated in
 * {@code PackupService}.
 */
public record PackRequest(
        String boxSize,
        Double weightKg
) {
}
