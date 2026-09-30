package com.shopstack.common.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
}