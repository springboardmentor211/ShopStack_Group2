package com.oneshop.service;

import com.oneshop.modal.Coupon;
import java.util.List;

public interface CouponService {
    Coupon createCoupon(Coupon coupon);
    List<Coupon> getAllCoupons();
    Coupon getCouponByCode(String code);
    Coupon getCouponById(Long id);
    void deleteCoupon(Long id);
}