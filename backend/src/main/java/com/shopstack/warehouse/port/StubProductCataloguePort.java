package com.shopstack.warehouse.port;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Sprint 1 stub. The product module has no catalogue yet, so any SKU is treated as
 * known and a placeholder name is derived from it.
 *
 * <p>W-10 removes this class in favour of the real product-module implementation.
 * Set {@code shopstack.warehouse.stub-ports=false} to disable it earlier.
 */
@Component
@ConditionalOnProperty(name = "shopstack.warehouse.stub-ports", havingValue = "true", matchIfMissing = true)
public class StubProductCataloguePort implements ProductCataloguePort {

    @Override
    public ProductInfo findBySku(String sku) {
        if (sku == null || sku.isBlank()) {
            return null;
        }
        return new ProductInfo(
                humanize(sku),
                null,
                "Uncategorised",
                null,
                10
        );
    }

    private String humanize(String sku) {
        String stripped = sku.startsWith("S360-") ? sku.substring(5) : sku;
        return String.join(" ", List.of(stripped.split("[-_]")));
    }
}
