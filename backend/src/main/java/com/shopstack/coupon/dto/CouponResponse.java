
package com.shopstack.coupon.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.shopstack.coupon.entity.Coupon;

public record CouponResponse(
    Long id,
    String code,
    String description,
    String discountType,
    BigDecimal discountValue,
    Integer usageCount,
    String status,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal minOrderAmount
) {
    public static CouponResponse from(Coupon coupon) {
        return new CouponResponse(
            coupon.getId(),
            coupon.getCode(),
            coupon.getDescription(),
            coupon.getDiscountType(),
            coupon.getDiscountValue(),
            coupon.getUsageCount(),
            coupon.getStatus(),
            coupon.getStartDate(),
            coupon.getEndDate(),
            coupon.getMinOrderAmount()
        );
    }
}
