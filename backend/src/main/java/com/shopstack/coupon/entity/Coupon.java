
package com.shopstack.coupon.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "vendor_coupons",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_vendor_coupon_code",
        columnNames = "code"
    )
)
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, length = 20)
    private String discountType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(nullable = false)
    private Integer usageCount = 0;

    @Column(nullable = false, length = 20)
    private String status = "Active";

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrderAmount;

    public Coupon() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public Integer getUsageCount() { return usageCount; }
    public void setUsageCount(Integer usageCount) {
        this.usageCount = usageCount;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }
}
