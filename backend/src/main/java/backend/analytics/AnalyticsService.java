package com.shop360.backend.analytics;

import com.shop360.backend.product.Product;
import com.shop360.backend.product.ProductRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final ProductRepository repository;

    public AnalyticsService(ProductRepository repository) {
        this.repository = repository;
    }

    public Map<String, Object> getInventoryAnalytics() {

        List<Product> products = repository.findAll();

        long totalProducts = products.size();

        int totalStock = products.stream()
                .mapToInt(Product::getStock)
                .sum();

        long outOfStock = products.stream()
                .filter(p -> p.getStock() == 0)
                .count();

        long lowStock = products.stream()
                .filter(p -> p.getStock() > 0
                        && p.getStock() <= 5)
                .count();

        BigDecimal inventoryValue = products.stream()
                .map(p -> p.getPrice().multiply(
                        BigDecimal.valueOf(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("totalProducts", totalProducts);
        result.put("totalStock", totalStock);
        result.put("outOfStock", outOfStock);
        result.put("lowStock", lowStock);
        result.put("inventoryValue", inventoryValue);

        return result;
    }
}