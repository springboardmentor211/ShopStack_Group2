# ShopSphere - Enterprise Multi-Vendor E-Commerce Platform

ShopSphere is a full-stack, enterprise-grade multi-vendor e-commerce platform built with React.js frontend, Spring Boot microservices backend, PostgreSQL primary database, Redis caching, Kafka event stream, and Docker/Kubernetes infrastructure.

---

## 🏗 Architecture Overview

```
                        ┌───────────────────────────────────┐
                        │      React Frontend Application   │
                        │ (Customer, Vendor, Admin, Staff)  │
                        └─────────────────┬─────────────────┘
                                          │
                                   HTTP / REST / WS
                                          │
                        ┌─────────────────▼─────────────────┐
                        │   API Gateway (Spring Cloud)      │
                        │       Port: 8080 (Auth/JWT)       │
                        └─────────────────┬─────────────────┘
                                          │
        ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
        │                  │              │              │                  │
 ┌──────▼──────┐    ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐    ┌──────▼──────┐
 │ Auth Svc    │    │ User Svc    │ │ Product Svc│ │Inventory Svc│    │ Order Svc   │
 │ Port: 8081  │    │ Port: 8082  │ │ Port: 8083 │ │ Port: 8084 │    │ Port: 8085  │
 └──────┬──────┘    └──────┬──────┘ └─────┬──────┘ └─────┬──────┘    └──────┬──────┘
        │                  │              │              │                  │
 ┌──────▼──────┐    ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐    ┌──────▼──────┐
 │ Payment Svc │    │Warehouse Svc│ │ Shipping Svc││ Coupon Svc  │    │Notification │
 │ Port: 8086  │    │ Port: 8087  │ │ Port: 8088 │ │ Port: 8089 │    │ Port: 8090  │
 └─────────────┘    └─────────────┘ └────────────┘ └────────────┘    └─────────────┘
                                                                            │
                                                                     ┌──────▼──────┐
                                                                     │ Analytics   │
                                                                     │ Port: 8091  │
                                                                     └─────────────┘
```

---

## 📁 Repository Directory Structure

```
ShopSphere/
├── .github/                  # CI/CD Workflows & Issue Templates
│   ├── workflows/            # GitHub Actions (Backend, Frontend, CD)
│   └── ISSUE_TEMPLATE/       # GitHub Issue & PR Templates
├── docs/                     # Project Specifications & Implementation Plans
├── backend/                  # Spring Boot Microservices Monorepo (Maven)
│   ├── api-gateway/          # Spring Cloud Gateway (Port 8080)
│   ├── auth-service/         # JWT Auth & Security Service (Port 8081)
│   ├── user-service/         # User & Vendor Profile Management (Port 8082)
│   ├── product-service/      # Product Catalog, Categories & Reviews (Port 8083)
│   ├── inventory-service/    # Stock Management & Low-Stock Alerts (Port 8084)
│   ├── order-service/        # Order Processing & History (Port 8085)
│   ├── payment-service/      # Stripe/Razorpay Payment Gateways (Port 8086)
│   ├── warehouse-service/    # Pick, Pack & Warehouse Allocation (Port 8087)
│   ├── shipping-service/     # Shipping Carrier Integrations & Tracking (Port 8088)
│   ├── coupon-service/       # Promotion & Discount Engine (Port 8089)
│   ├── notification-service/ # Email, SMS (Twilio), FCM Notifications (Port 8090)
│   └── analytics-service/    # Reports, Business Metrics & Exports (Port 8091)
├── frontend/                 # React.js Modular Frontend Application
│   ├── src/                  # Components, Hooks, Context, Feature Views
│   └── public/
├── database/                 # PostgreSQL Initialization Scripts & Redis Config
│   ├── init/                 # SQL database setup and seed data
│   └── redis/                # Redis config
└── infra/                    # DevOps Infrastructure
    ├── docker/               # Docker Compose & Dockerfiles
    ├── k8s/                  # Kubernetes Deployment Manifests
    └── nginx/                # Reverse Proxy Config
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+ / npm 9+
- Docker & Docker Compose
- Maven 3.8+

### 1. Database & Infrastructure Setup
Run local infrastructure (PostgreSQL, Redis, Kafka):
```bash
docker-compose -f infra/docker/docker-compose.yml up -d
```

### 2. Backend Microservices
Build and run the Spring Boot services:
```bash
cd backend
mvn clean install
mvn spring-boot:run -pl api-gateway
```

### 3. Frontend Setup
Install dependencies and run local dev server:
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Roles & Permissions
- **Customer**: Product browsing, cart management, wishlist, checkout, order tracking.
- **Vendor**: Onboarding, product catalog management, stock updates, sales analytics.
- **Administrator**: Vendor approvals, commission settings, marketplace analytics, system monitoring.
- **Warehouse Staff**: Order fulfillment, pick/pack operations, stock allocation.
