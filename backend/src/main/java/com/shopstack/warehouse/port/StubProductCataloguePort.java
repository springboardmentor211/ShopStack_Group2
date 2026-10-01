package com.shopstack.warehouse.port;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Sprint 1 stub. The product module has no catalogue yet, so a small in-memory
 * catalogue mirroring {@code frontend/src/warehouse/mocks/catalogMock.js} is used
 * so the API returns realistic, non-null product data (name, variant, category,
 * vendorId, threshold, imageUrl). Unknown SKUs fall back to a name derived from
 * the SKU.
 *
 * <p>W-10 removes this class in favour of the real product-module implementation.
 * Set {@code shopstack.warehouse.stub-ports=false} to disable it earlier.
 */
@Component
@ConditionalOnProperty(name = "shopstack.warehouse.stub-ports", havingValue = "true", matchIfMissing = true)
public class StubProductCataloguePort implements ProductCataloguePort {

    private static final String IMG = "https://images.pexels.com/photos/%s/pexels-photo-%s.jpeg?auto=compress&cs=tinysrgb&w=300";

    private static final Map<String, ProductInfo> CATALOGUE = Map.ofEntries(
            Map.entry("S360-MOB-001", new ProductInfo("Shop360 Pro Smartphone", "Midnight Black · 256 GB",
                    "Electronics", "VND-101", 10, image("27596328"))),
            Map.entry("S360-AUD-002", new ProductInfo("AirWave Wireless Headphones", "Pearl White",
                    "Electronics", "VND-101", 8, image("8038326"))),
            Map.entry("S360-LAP-003", new ProductInfo("NovaBook Laptop", "Silver · 16 GB / 512 GB",
                    "Electronics", "VND-101", 5, image("25839642"))),
            Map.entry("S360-WAT-004", new ProductInfo("PulseFit Smartwatch", "Graphite",
                    "Electronics", "VND-102", 8, image("3646165"))),
            Map.entry("S360-SHO-005", new ProductInfo("Urban Runner Sneakers", "Grey · UK 8",
                    "Fashion", "VND-103", 10, image("26852035"))),
            Map.entry("S360-FAS-006", new ProductInfo("Linen Overshirt", "Sand · M",
                    "Fashion", "VND-105", 7, image("22441291"))),
            Map.entry("S360-HOM-007", new ProductInfo("BrewMaster Blender", "Cream · 750W",
                    "Home & Kitchen", "VND-106", 6, image("30946794"))),
            Map.entry("S360-BEA-008", new ProductInfo("GlowCare Face Serum", "30 ml",
                    "Beauty & Personal Care", "VND-104", 12, image("20377674")))
    );

    @Override
    public ProductInfo findBySku(String sku) {
        if (sku == null || sku.isBlank()) {
            return null;
        }
        ProductInfo known = CATALOGUE.get(sku);
        if (known != null) {
            return known;
        }
        return new ProductInfo(humanize(sku), null, "Uncategorised", null, 10, null);
    }

    private static String image(String id) {
        return IMG.formatted(id, id);
    }

    private String humanize(String sku) {
        String stripped = sku.startsWith("S360-") ? sku.substring(5) : sku;
        return String.join(" ", List.of(stripped.split("[-_]")));
    }
}
