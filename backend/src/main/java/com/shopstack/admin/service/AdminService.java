package com.shopstack.admin.service;

import com.shopstack.admin.entity.Admin;
import com.shopstack.admin.repository.AdminRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public List<Admin> getAllAdmins() {
        return repository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return repository.findById(id);
    }

    public Optional<Admin> getAdminByEmail(String email) {
        return repository.findByEmail(email);
    }
}