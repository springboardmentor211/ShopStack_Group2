# ShopStack Backend

Spring Boot backend for the ShopStack multi-vendor e-commerce platform. The
**warehouse module** (inbound ASNs, putaway, inventory, stock movements and the
order summary dashboard) is the part implemented end-to-end; other modules
(`auth`, `product`, `vendor`, `order`, `customer`, `admin`) provide the
surrounding scaffolding.

- Java 17 target (builds/runs on the JDK 25 installed on this machine)
- Spring Boot 4.1.1, Spring Security, Spring Data JPA
- PostgreSQL + Flyway migrations
- Port **8080**

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| JDK | 17+ | `JAVA_HOME` must point at the install |
| Maven | bundled | use `mvnw.cmd` (Windows) / `./mvnw` |
| PostgreSQL | 15+ | Docker or a local install |

This machine already has JDK 25 at `C:\Program Files\Java\jdk-25.0.2` and a local
PostgreSQL 18 service on port `5432`. `JAVA_HOME` is set user-wide; open a new
terminal for it to take effect.

## 1. Start PostgreSQL

The backend connects to **`shopstack_db`** (user `postgres`) — not the
`shopsphere_*` databases created by `database/init`, which belong to an older
per-service split. Flyway creates the schema itself, so only the empty database
is needed.

```powershell
# Option A — use the local PostgreSQL 18 service
$env:PGPASSWORD="postgrespassword"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres -c "CREATE DATABASE shopstack_db;"

# Option B — Docker (only Postgres is required; Redis/Kafka are unused by the pom)
docker compose -f ..\infra\docker\docker-compose.yml up -d postgres
docker exec -it shopsphere-postgres psql -U postgres -c "CREATE DATABASE shopstack_db;"
```

## 2. Configure environment

Copy `.env.example` to `.env` (git-ignored) or export the variables in your
shell. See `application.properties` for the `${...}` placeholders.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DB_PASSWORD` | yes | — | PostgreSQL password |
| `JWT_SECRET` | no | dev-only insecure value | HMAC signing key, **≥ 32 bytes** |
| `CORS_ORIGINS` | no | `http://localhost:5173` | allowed frontend origins |
| `app.jwt.dev-token-endpoint-enabled` | no | `false` | registers `POST /api/auth/dev-token` |

The quickest local setup is the `local` profile, which supplies a dev DB
password and enables the dev-token endpoint:

```properties
# src/main/resources/application-local.properties
spring.datasource.password=${DB_PASSWORD:postgrespassword}
app.jwt.dev-token-endpoint-enabled=true
```

## 3. Run

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-25.0.2"   # if not already on PATH
cd D:\Projects\ShopStack_Group2\backend
$env:DB_PASSWORD="postgrespassword"
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Or set the flag without a profile:

```powershell
$env:SPRING_APPLICATION_JSON='{"app":{"jwt":{"dev-token-endpoint-enabled":true}}}'
.\mvnw.cmd spring-boot:run
```

Run the tests:

```powershell
.\mvnw.cmd test
```

## 4. Warehouse module

Package: `com.shopstack.warehouse` (`controller`, `service`, `repository`,
`entity`, `dto`). Security is in `com.shopstack.security.jwt`
(`JwtUtil`, `JwtFilter`, `JwtAuthenticationToken`).

### Authentication

Every `/api/warehouses/**` route requires a `Bearer` JWT with a `WAREHOUSE_STAFF`
role and a `warehouseId` claim. A token may only access its own warehouse;
requesting another returns **403**. Missing/invalid token returns **401**.

Mint a dev token while the real login flow does not exist:

```powershell
$body = Invoke-RestMethod -Method Post `
  "http://localhost:8080/api/auth/dev-token?warehouseId=WH-NORTH&role=WAREHOUSE_STAFF"
$token = $body.accessToken
$H = @{ Authorization = "Bearer $token" }
```

### Endpoints

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/api/auth/me` | warehouse context for the logged-in user |
| 2 | GET | `/api/warehouses/{warehouseId}/inventory` | inventory rows |
| 3 | GET | `/api/warehouses/{warehouseId}/bins` | storage bins |
| 4 | GET | `/api/warehouses/{warehouseId}/inbound` | inbound ASNs |
| 5 | POST | `/api/warehouses/{warehouseId}/inbound/{id}/receive` | put away an ASN — body `{"bin":"B-01-04"}` |
| 6 | GET | `/api/warehouses/{warehouseId}/movements` | stock movements |
| 7 | GET | `/api/warehouses/{warehouseId}/orders/summary` | order counts by status |

Receive is transactional: on success it writes the inventory row and records a
`Putaway` movement. Re-receiving returns **409**, an unknown bin **422**, an
unknown shipment **404**. All errors use `{ "message": "..." }`.

### Database (Flyway, `src/main/resources/db/migration`)

| Version | File | Contents |
|---|---|---|
| V2 | `V2__create_warehouse_tables.sql` | `warehouses`, `warehouse_bins`, `inbound_shipments`, `inventory_rows`, `stock_movements` |
| V3 | `V3__seed_warehouse_bins.sql` | dev seed: `WH-NORTH` / `WH-SOUTH`, bins, two pending ASNs |

> If `flyway_schema_history` reports V3 applied but the seed ASNs are missing,
> re-run the V3 INSERT statements manually — Flyway will not re-execute an
> already-recorded version.

### Smoke test (verified working)

```powershell
$env:PGPASSWORD="postgrespassword"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres -d shopstack_db -c `
  "INSERT INTO inbound_shipments (id,warehouse_id,vendor_id,sku,qty,status,arrived_at) VALUES
   ('ASN-2051','WH-NORTH','VND-103','S360-SHO-005',60,'pending', now() - interval '2 hours')
   ON CONFLICT (id) DO NOTHING;"

$body  = Invoke-RestMethod -Method Post "http://localhost:8080/api/auth/dev-token?warehouseId=WH-NORTH&role=WAREHOUSE_STAFF"
$H     = @{ Authorization = "Bearer $($body.accessToken)" }
Invoke-RestMethod -Uri "http://localhost:8080/api/warehouses/WH-NORTH/inventory" -Headers $H
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/warehouses/WH-NORTH/inbound/ASN-2051/receive" `
  -Headers $H -ContentType "application/json" -Body '{"bin":"B-01-04"}'
```

Expected: `200` on receive, inventory gains the SKU in the target bin, a
`Putaway` movement appears; a second receive returns `409`, an invalid bin
`422`, a wrong-warehouse token `403`, and no token `401`.

### Frontend integration

The frontend (`frontend/`) runs against mocks by default. To hit this backend,
create `frontend/.env`:

```
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

No Vite proxy is configured, so requests are cross-origin and rely on
`app.cors.allowed-origins`. The host app must call
`setAuthTokenGetter(() => token)` from
`frontend/src/warehouse/services/http.js`.

## Project layout

```
backend/
├── src/main/java/com/shopstack/
│   ├── warehouse/     # controllers, services, repos, entities, DTOs
│   ├── auth/          # AuthController, DevTokenController
│   ├── security/jwt/  # JwtUtil, JwtFilter, JwtAuthenticationToken
│   ├── common/        # ApiResponse, exceptions, GlobalExceptionHandler
│   └── config/        # SecurityConfig, CorsConfig
├── src/main/resources/
│   ├── application.properties
│   ├── application-local.properties
│   └── db/migration/  # Flyway V2, V3
└── .env.example       # environment template
```
