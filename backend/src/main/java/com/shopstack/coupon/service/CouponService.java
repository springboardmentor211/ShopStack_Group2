
package com.shopstack.coupon.service;

import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.shopstack.coupon.dto.CouponRequest;
import com.shopstack.coupon.dto.CouponResponse;
import com.shopstack.coupon.entity.Coupon;
import com.shopstack.coupon.repository.CouponRepository;

@Service
@Transactional
public class CouponService {

    private final CouponRepository repository;

    public CouponService(CouponRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CouponResponse> getAll() {
        return repository.findAll()
            .stream()
            .map(CouponResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public CouponResponse getById(Long id) {
        return CouponResponse.from(findCoupon(id));
    }

    public CouponResponse create(CouponRequest request) {
        validateDates(request);

        String code = normalizeCode(request.code());

        if (repository.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A coupon with this code already exists"
            );
        }

        Coupon coupon = new Coupon();
        applyRequest(coupon, request);
        coupon.setCode(code);
        coupon.setUsageCount(0);

        return CouponResponse.from(repository.save(coupon));
    }

    public CouponResponse update(Long id, CouponRequest request) {
        validateDates(request);

        Coupon coupon = findCoupon(id);
        String code = normalizeCode(request.code());

        repository.findByCodeIgnoreCase(code)
            .filter(existing -> !existing.getId().equals(id))
            .ifPresent(existing -> {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Another coupon already uses this code"
                );
            });

        applyRequest(coupon, request);
        coupon.setCode(code);

        return CouponResponse.from(repository.save(coupon));
    }

    public CouponResponse updateStatus(Long id, String status) {
        String normalized = status.trim().toLowerCase(Locale.ROOT);

        if (!List.of("active", "inactive", "scheduled", "expired")
                .contains(normalized)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Status must be Active, Inactive, Scheduled or Expired"
            );
        }

        Coupon coupon = findCoupon(id);
        coupon.setStatus(
            normalized.substring(0, 1).toUpperCase(Locale.ROOT)
                + normalized.substring(1)
        );

        return CouponResponse.from(repository.save(coupon));
    }

    public void delete(Long id) {
        repository.delete(findCoupon(id));
    }

    private Coupon findCoupon(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Coupon not found: " + id
            ));
    }

    private void applyRequest(Coupon coupon, CouponRequest request) {
        String type = request.discountType().trim()
            .toLowerCase(Locale.ROOT);

        if (type.equals("percentage")
                && request.discountValue().compareTo(
                    new java.math.BigDecimal("100")) > 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Percentage discount cannot exceed 100"
            );
        }

        coupon.setCode(normalizeCode(request.code()));
        coupon.setDescription(request.description());
        coupon.setDiscountType(
            type.equals("fixed") ? "Fixed" : "Percentage"
        );
        coupon.setDiscountValue(request.discountValue());
        coupon.setStatus(capitalize(request.status()));
        coupon.setStartDate(request.startDate());
        coupon.setEndDate(request.endDate());
        coupon.setMinOrderAmount(request.minOrderAmount());
    }

    private void validateDates(CouponRequest request) {
        if (request.startDate() != null
                && request.endDate() != null
                && request.endDate().isBefore(request.startDate())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "End date cannot be before start date"
            );
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String capitalize(String value) {
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return normalized.substring(0, 1).toUpperCase(Locale.ROOT)
            + normalized.substring(1);
    }
}
