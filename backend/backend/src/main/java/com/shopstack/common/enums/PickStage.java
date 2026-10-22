package com.shopstack.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;
import java.util.Optional;

/**
 * Filter/label for the Pickup queue. {@link #ALL} is a query-only pseudo-stage: it is
 * accepted by {@code GET /pickup?stage=} but never emitted in a response.
 *
 * <p>{@link #TO_PICK} corresponds to {@code confirmed} orders and {@link #PICKED} to
 * {@code picked} orders.
 */
public enum PickStage {
    TO_PICK,
    PICKED,
    ALL;

    @JsonValue
    public String wireValue() {
        return name().toLowerCase(Locale.ROOT);
    }

    public static Optional<PickStage> fromWire(String value) {
        if (value == null || value.isBlank()) {
            return Optional.of(ALL);
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        for (PickStage stage : values()) {
            if (stage.name().equals(normalized)) {
                return Optional.of(stage);
            }
        }
        return Optional.empty();
    }
}
