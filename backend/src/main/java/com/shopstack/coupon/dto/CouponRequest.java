
package com.shopstack.coupon.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CouponRequest(
    @NotBlank
    @Size(max = 50)
    String code,

    @Size(max = 255)
    String description,

    @NotBlank
    @Pattern(regexp = "(?i)percentage|fixed")
    String discountType,

    @NotNull
    @DecimalMin(value = "0.01")
    BigDecimal discountValue,

    @NotBlank
    @Pattern(regexp = "(?i)active|inactive|scheduled|expired")
    String status,

    LocalDate startDate,

    LocalDate endDate,

    @DecimalMin(value = "0.00")
    BigDecimal minOrderAmount
) {
}
