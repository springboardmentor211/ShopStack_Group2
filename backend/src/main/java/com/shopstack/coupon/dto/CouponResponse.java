package com.shopstack.coupon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {

    private Long id;
    private String code;
    private BigDecimal discountPercentage;
    private BigDecimal minimumOrderAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private LocalDateTime expiryDate;
    private Boolean active;
}