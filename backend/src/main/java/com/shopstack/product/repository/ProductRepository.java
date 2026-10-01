package com.shopstack.product.repository;

import com.shopstack.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Fetch all active products for the catalog
    List<Product> findByActiveTrue();

    // Fetch products filtered by category
    List<Product> findByCategoryAndActiveTrue(String category);

    // Search products by name (case-insensitive)
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}