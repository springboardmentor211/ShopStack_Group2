package com.oneshop.service;

import com.oneshop.modal.Address;
import java.util.List;

public interface AddressService {
    Address addAddress(Address address);
    List<Address> getAddressesByUserId(Long userId);
    Address getAddressById(Long id);
    void deleteAddress(Long id);
}