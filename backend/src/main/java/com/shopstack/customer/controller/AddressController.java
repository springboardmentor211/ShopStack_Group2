package com.shopstack.customer.controller;

import com.shopstack.customer.dto.AddressRequest;
import com.shopstack.customer.dto.AddressResponse;
import com.shopstack.customer.service.AddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // POST: Add a new address for a specific customer
    @PostMapping("/{customerId}/addresses")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable Long customerId,
            @Valid @RequestBody AddressRequest request) {
        return new ResponseEntity<>(addressService.addAddress(customerId, request), HttpStatus.CREATED);
    }

    // GET: Fetch all saved addresses for a specific customer
    @GetMapping("/{customerId}/addresses")
    public ResponseEntity<List<AddressResponse>> getCustomerAddresses(@PathVariable Long customerId) {
        return ResponseEntity.ok(addressService.getCustomerAddresses(customerId));
    }

    // DELETE: Delete a saved address by its address ID
    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.noContent().build();
    }
}