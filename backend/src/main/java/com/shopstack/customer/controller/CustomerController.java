package com.shopstack.customer.controller;

import com.shopstack.customer.dto.CustomerResponseDTO;
import com.shopstack.customer.dto.CustomerUpdateRequest;
import com.shopstack.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // GET: Customer Profile Details (for Account Screen)
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerProfile(id));
    }

    // PUT: Profile Update Karna (Edit Profile Screen)
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateProfile(
            @PathVariable Long id,
            @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateCustomerProfile(id, request));
    }
}