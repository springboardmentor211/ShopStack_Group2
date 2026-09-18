package com.oneshop.service.impl;

import com.oneshop.modal.Address;
import com.oneshop.repository.AddressRepository;
import com.oneshop.service.AddressService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor 
public class AddressServiceImpl implements AddressService {

    
    private AddressRepository addressRepository;

    @Override
    public Address addAddress(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
    }

    @Override
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
}