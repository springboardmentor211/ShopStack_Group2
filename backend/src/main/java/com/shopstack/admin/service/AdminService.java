
package com.shopstack.admin.service;

import com.shopstack.admin.dto.AdminRequestDTO;
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

    // GET - All admins
    public List<Admin> getAllAdmins() {
        return repository.findAll();
    }

    // GET - Admin by ID
    public Optional<Admin> getAdminById(Long id) {
        return repository.findById(id);
    }

    // GET - Admin by Email
    public Optional<Admin> getAdminByEmail(String email) {
        return repository.findByEmail(email);
    }

    // POST - Create Admin
    public Admin createAdmin(AdminRequestDTO request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                "Admin with this email already exists"
            );
        }

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());

        return repository.save(admin);
    }

    // PUT - Update Admin
    public Admin updateAdmin(Long id, AdminRequestDTO request) {

        Admin admin = repository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Admin not found: " + id)
            );

        Optional<Admin> existingAdmin =
            repository.findByEmail(request.getEmail());

        if (existingAdmin.isPresent()
                && !existingAdmin.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                "Email already belongs to another admin"
            );
        }

        admin.setName(request.getName());
        admin.setEmail(request.getEmail());

        return repository.save(admin);
    }

    // DELETE - Delete Admin
    public void deleteAdmin(Long id) {

        if (!repository.existsById(id)) {
            throw new IllegalArgumentException(
                "Admin not found: " + id
            );
        }

        repository.deleteById(id);
    }
}
