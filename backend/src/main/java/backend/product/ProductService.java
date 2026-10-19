package com.shop360.backend.product;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // Get one product
    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found"
                    ));
    }

    // Add product
    public Product addProduct(Product product) {

        if (product.getName() == null
                || product.getName().isBlank()
                || product.getSku() == null
                || product.getSku().isBlank()
                || product.getPrice() == null
                || product.getPrice().signum() < 0
                || product.getStock() < 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter valid product details"
            );
        }

        return repository.save(product);
    }

    // Update product
    public Product updateProduct(
            Long id,
            Product updatedProduct) {

        Product product = getProductById(id);

        if (updatedProduct.getName() == null
                || updatedProduct.getName().isBlank()
                || updatedProduct.getSku() == null
                || updatedProduct.getSku().isBlank()
                || updatedProduct.getPrice() == null
                || updatedProduct.getPrice().signum() < 0
                || updatedProduct.getStock() < 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter valid product details"
            );
        }

        product.setName(updatedProduct.getName());
        product.setSku(updatedProduct.getSku());
        product.setCategory(updatedProduct.getCategory());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());

        return repository.save(product);
    }

    // Update stock
    public Product updateStock(Long id, int stock) {

        if (stock < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stock cannot be negative"
            );
        }

        Product product = getProductById(id);
        product.setStock(stock);

        return repository.save(product);
    }

    // Delete product
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        repository.delete(product);
    }
}