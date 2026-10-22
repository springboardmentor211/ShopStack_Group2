
package com.shop360.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(
    scanBasePackages = {
        "com.shop360.backend",
        "com.shopstack",
        "backend"
    }
)
@EntityScan(basePackages = {
    "com.shop360.backend",
    "com.shopstack",
    "backend"
})
@EnableJpaRepositories(basePackages = {
    "com.shop360.backend",
    "com.shopstack",
    "backend"
})
public class Shop360Application {

    public static void main(String[] args) {
        SpringApplication.run(Shop360Application.class, args);
    }
}
