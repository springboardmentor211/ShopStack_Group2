package com.shopstack.coupon.service;

import com.shopstack.coupon.dto.ApplyCouponRequest;
import com.shopstack.coupon.dto.CouponResponse;
import com.shopstack.coupon.entity.Coupon;
import com.shopstack.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    // Validate and Apply Coupon for Customer Checkout
    public CouponResponse applyCoupon(ApplyCouponRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCode())
                .orElseThrow(() -> new RuntimeException("Invalid or expired coupon code: " + request.getCode()));

        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon code has expired");
        }

        if (request.getOrderTotal().compareTo(coupon.getMinimumOrderAmount()) < 0) {
            throw new RuntimeException("Order total must be at least " + coupon.getMinimumOrderAmount() + " to use this coupon");
        }

        // Calculate discount
        BigDecimal discountPercentage = coupon.getDiscountPercentage().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountAmount = request.getOrderTotal().multiply(discountPercentage).setScale(2, RoundingMode.HALF_UP);
        BigDecimal finalAmount = request.getOrderTotal().subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);

        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountPercentage(coupon.getDiscountPercentage())
                .minimumOrderAmount(coupon.getMinimumOrderAmount())
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .expiryDate(coupon.getExpiryDate())
                .active(coupon.getActive())
                .build();
    }
}