
package com.shopstack.coupon.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.shopstack.coupon.dto.CouponRequest;
import com.shopstack.coupon.dto.CouponResponse;
import com.shopstack.coupon.service.CouponService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vendor/coupons")
public class CouponController {

    private final CouponService service;

    public CouponController(CouponService service) {
        this.service = service;
    }

    @GetMapping
    public List<CouponResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CouponResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CouponResponse create(@Valid @RequestBody CouponRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public CouponResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public CouponResponse updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");

        if (status == null || status.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Status is required"
            );
        }

        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
