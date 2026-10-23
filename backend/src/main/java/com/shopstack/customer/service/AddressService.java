package com.shopstack.customer.service;

import com.shopstack.customer.dto.AddressRequest;
import com.shopstack.customer.dto.AddressResponse;
import com.shopstack.customer.entity.Address;
import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.AddressRepository;
import com.shopstack.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    // Add new address for customer
    public AddressResponse addAddress(Long customerId, AddressRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        Address address = Address.builder()
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .addressType(request.getAddressType() != null ? request.getAddressType() : "HOME")
                .isDefault(request.isDefault())
                .customer(customer)
                .build();

        Address savedAddress = addressRepository.save(address);
        return mapToResponse(savedAddress);
    }

    // Customer getaddresses 
    public List<AddressResponse> getCustomerAddresses(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new RuntimeException("Customer not found with id: " + customerId);
        }

        return addressRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    //  delete Address 
    public void deleteAddress(Long addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new RuntimeException("Address not found with id: " + addressId);
        }
        addressRepository.deleteById(addressId);
    }

    // Helper method to convert Entity to Response DTO
    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .addressType(address.getAddressType())
                .isDefault(address.isDefault())
                .build();
    }
}