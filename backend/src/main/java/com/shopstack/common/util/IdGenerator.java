package com.shopstack.common.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Component
public class IdGenerator {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public String generateMovementId() {
        Long nextVal = (Long) entityManager.createNativeQuery("SELECT nextval('mov_seq')")
                .getSingleResult();
        return String.format("MOV-%04d", nextVal);
    }

    /**
     * Builds a carrier-style tracking id, e.g. {@code BlueDart -> BD-2938471}.
     *
     * <p>Takes the first two letters of the carrier name upper-cased, falling back to
     * {@code TR} for names shorter than two characters. Real carrier numbering is out of
     * scope for this module — the id only has to be unique and well-formed, since the
     * shipment manifest is not integrated.
     */
    @Transactional
    public String generateTrackingId(String carrier) {
        Long nextVal = (Long) entityManager.createNativeQuery("SELECT nextval('tracking_seq')")
                .getSingleResult();
        String prefix = prefix(carrier);
        return String.format("%s-%d", prefix, nextVal);
    }

    private String prefix(String carrier) {
        if (carrier == null) {
            return "TR";
        }
        String trimmed = carrier.trim().toUpperCase(Locale.ROOT);
        if (trimmed.length() < 2) {
            return "TR";
        }
        return trimmed.substring(0, 2);
    }
}
