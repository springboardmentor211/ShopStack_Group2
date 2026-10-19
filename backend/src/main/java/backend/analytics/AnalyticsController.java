package com.shop360.backend.analytics;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/inventory")
    public Map<String, Object> getInventoryAnalytics() {
        return service.getInventoryAnalytics();
    }
}