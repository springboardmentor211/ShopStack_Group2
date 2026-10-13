
package com.shopstack.admin.controller;

import com.shopstack.admin.dto.AdminRequestDTO;
import com.shopstack.admin.dto.AdminResponseDTO;
import com.shopstack.admin.entity.Admin;
import com.shopstack.admin.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Convert Entity to Response DTO
    private AdminResponseDTO toResponse(Admin admin) {
        return new AdminResponseDTO(
            admin.getId(),
            admin.getName(),
            admin.getEmail()
        );
    }

    // GET - All admins
    @GetMapping("/profiles")
    public ResponseEntity<List<AdminResponseDTO>> getAllAdmins() {

        List<AdminResponseDTO> admins = adminService.getAllAdmins()
            .stream()
            .map(this::toResponse)
            .toList();

        return ResponseEntity.ok(admins);
    }

    // GET - Admin by ID
    @GetMapping("/profiles/{id}")
    public ResponseEntity<AdminResponseDTO> getAdminById(
            @PathVariable Long id) {

        return adminService.getAdminById(id)
            .map(this::toResponse)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST - Create admin
    @PostMapping("/profiles")
    public ResponseEntity<AdminResponseDTO> createAdmin(
            @RequestBody AdminRequestDTO request) {

        Admin created = adminService.createAdmin(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(toResponse(created));
    }

    // PUT - Update admin
    @PutMapping("/profiles/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(
            @PathVariable Long id,
            @RequestBody AdminRequestDTO request) {

        Admin updated = adminService.updateAdmin(id, request);

        return ResponseEntity.ok(toResponse(updated));
    }

    // DELETE - Delete admin
    @DeleteMapping("/profiles/{id}")
    public ResponseEntity<Void> deleteAdmin(
            @PathVariable Long id) {

        adminService.deleteAdmin(id);

        return ResponseEntity.noContent().build();
    }
}
