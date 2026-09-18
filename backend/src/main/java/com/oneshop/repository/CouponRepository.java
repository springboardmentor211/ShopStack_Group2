package com.oneshop.repository;

import com.oneshop.modal.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
}