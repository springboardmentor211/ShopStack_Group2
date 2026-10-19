package com.shop360.backend.product;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return service.getProductById(id);
    }

    // Add product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    // Update product
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return service.updateProduct(id, product);
    }

    // Update stock
    @PatchMapping("/{id}/stock")
    public Product updateStock(
            @PathVariable Long id,
            @RequestBody StockRequest request) {

        return service.updateStock(id, request.stock());
    }

    // Delete product
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
    }

    public record StockRequest(int stock) {
    }
}