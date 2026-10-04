package com.shopstack.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;
import java.util.Optional;

/**
 * Filter/label for the Packup queue. {@link #ALL} is a query-only pseudo-stage: it is
 * accepted by {@code GET /packup?stage=} but never emitted in a response.
 *
 * <p>Stage is derived from order status plus the packing row, because packing and
 * shipping are separate steps: {@code picked} maps to {@link #TO_PACK}, {@code packed} and
 * not yet shipped maps to {@link #READY_TO_SHIP}, and {@code shipped} maps to
 * {@link #SHIPPED}. {@link #PACKED} is exposed as a filter for screens that only want the
 * packed-but-not-handed-over set.
 */
public enum PackStage {
    TO_PACK,
    PACKED,
    READY_TO_SHIP,
    SHIPPED,
    ALL;

    @JsonValue
    public String wireValue() {
        return name().toLowerCase(Locale.ROOT);
    }

    public static Optional<PackStage> fromWire(String value) {
        if (value == null || value.isBlank()) {
            return Optional.of(ALL);
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        for (PackStage stage : values()) {
            if (stage.name().equals(normalized)) {
                return Optional.of(stage);
            }
        }
        return Optional.empty();
    }
}
