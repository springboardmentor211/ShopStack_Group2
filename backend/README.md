# ShopStack Backend

Spring Boot backend for the ShopStack multi-vendor e-commerce platform. The
**warehouse module** (inbound ASNs, putaway, inventory, stock movements and the
order summary dashboard) plus **JWT auth and warehouse scoping** are implemented
end-to-end. Other modules (`product`, `vendor`, `order`, `customer`, `admin`,
`cart`, `payment`, `shipping`, `coupon`, `notification`, `analytics`) are empty
scaffolding that the warehouse module reaches only through port interfaces.

---

## 1. Tech stack

Everything below is resolved from `pom.xml`; versions are the ones Maven
actually resolves (verify with `.\mvnw.cmd dependency:tree`).

### Language, build, runtime

| Tool | Version | Notes |
|---|---|---|
| Java | **17** target (`<java.version>17</java.version>`) | compiles and runs on a newer JDK; this machine has JDK **25.0.2 LTS** |
| Maven | **3.9.16** | via the bundled wrapper — `mvnw.cmd` (Windows) / `./mvnw` (Unix). Wrapper script version 3.3.4, `distributionType=only-script` |
| Spring Boot | **4.1.1** | the parent POM, so dependency versions are managed centrally |
| Git | 2.46.0 | single branch: `warehouse-backend` |

`java` is often not on `PATH` even when installed. Use
`& "$env:JAVA_HOME\bin\java.exe" -version`, or set `JAVA_HOME` before invoking
`mvnw.cmd`.

> **Offline gotcha**: `mvnw.cmd -o` (offline) breaks `maven-clean-plugin` with
> `NoClassDefFoundError: org/codehaus/plexus/util/Os` because the wrapper's
> local repo lacks the plugin's transitive deps. Run online, or skip `clean`.

### Framework — Spring Boot 4 modular starters

Spring Boot 4 splits the old monolithic starters into per-technology modules.
That is why these artifact names look unfamiliar:

| Dependency | Provides |
|---|---|
| `spring-boot-starter-webmvc` | Spring MVC, embedded **Tomcat 11.0.24**, HTTP message converters. *Not* the old `spring-boot-starter-web` |
| `spring-boot-starter-data-jpa` | Spring Data JPA + **Hibernate ORM 7.4.5** + HikariCP 7.0.2 pool |
| `spring-boot-starter-security` | Spring Security 7.1.1 |
| `spring-boot-starter-validation` | **Hibernate Validator 9.1.3** (Bean Validation) |
| `spring-boot-devtools` | hot reload, `runtime` + `optional` — not packaged into the jar |

Underlying Spring Framework is **7.0.9**; Spring Data is `spring-boot-data-jpa:4.1.1`.

### Persistence

| Tool | Version | Notes |
|---|---|---|
| Hibernate ORM | 7.4.5.Final | the JPA provider. **Transitive** — arrives via `spring-boot-hibernate`, so there is deliberately no `hibernate-core` entry in `pom.xml` |
| Hibernate Validator | 9.1.3.Final | Bean Validation impl, unrelated to the ORM despite the name |
| PostgreSQL JDBC | 42.7.13 | `runtime` scope |
| Flyway | 12.4.0 | `flyway-core` + `flyway-database-postgresql` + `spring-boot-flyway` |
| HikariCP | 7.0.2 | connection pool, defaults |

Two different Hibernates, two different jobs — worth keeping straight:

- **Hibernate ORM** runs the JPA mappings and talks to Postgres. It is configured
  with `spring.jpa.hibernate.ddl-auto=validate`, so it *verifies* the mapping
  against the schema but never creates it.
- **Hibernate Validator** checks field rules at controller binding time and
  produces the `MethodArgumentNotValidException` handled in
  `GlobalExceptionHandler`.

Where the code is Hibernate-specific rather than portable JPA:

- `IdGenerator` — `createNativeQuery("SELECT nextval('mov_seq')")` against a
  Postgres sequence, then formats `MOV-%04d`.
- `InboundShipmentRepository.findByIdWithLock` — `@Lock(PESSIMISTIC_WRITE)`
  native query, giving the one-200/one-409 behaviour on concurrent receive.
- `InventoryRowRepository.deleteEmptyRowsInOtherBins` — derived-delete query.

Because `ddl-auto=validate`, adding a column in a Flyway migration **without** the
matching entity field fails at application startup, not at compile time.

### Security

| Tool | Version | Notes |
|---|---|---|
| Spring Security | 7.1.1 | stateless, `SecurityFilterChain` bean |
| JJWT | 0.12.6 | `jjwt-api` (compile) + `jjwt-impl` + `jjwt-jackson` (runtime) |

- `JwtUtil` — HMAC-SHA signing via `Keys.hmacShaKeyFor`. The secret must be
  **≥ 32 bytes**; JJWT throws at startup on a shorter key, which is why the
  default in `application.properties` is deliberately long.
- `JwtFilter` — a `OncePerRequestFilter` reading `Authorization: Bearer <token>`.
  A malformed or expired token is simply ignored, so the request falls through to
  the authorization rules and yields **401**.
- `JwtAuthenticationToken` — an `AbstractAuthenticationToken` carrying
  `subject`, `warehouseId`, `role`, and a `ROLE_*` authority.
- `WarehouseAccessGuard` — compares the path `{warehouseId}` against the token's
  `warehouseId` claim and throws `AccessDeniedException` (**403**) on mismatch.
  This is the enforcement point for the API contracts' warehouse-scoping rule.

### Serialization

| Tool | Version | Notes |
|---|---|---|
| **Jackson 3** | 3.1.5 | package `tools.jackson.databind`, **not** `com.fasterxml` |
| Jackson 2 | 2.21.5 | still present, but only as a runtime dep **of JJWT** |

Jackson 3 moved to the `tools.jackson` namespace, which is why `SecurityConfig`
imports `tools.jackson.databind.ObjectMapper`. Do not "fix" that import to
`com.fasterxml.jackson.databind` — the class is not on the compile classpath.

### Boilerplate and logging

| Tool | Version | Notes |
|---|---|---|
| Lombok | 1.18.46 | `optional`; wired through `maven-compiler-plugin` `annotationProcessorPaths` for both `compile` and `test-compile`. Uses `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` |
| SLF4J | 2.0.18 | facade |
| Logback | 1.5.38 | backend, via `spring-boot-starter-logging` |
| Log4j bridge | 2.25.5 | `log4j-to-slf4j` + `jul-to-slf4j` so everything funnels into Logback |
| SnakeYAML | 2.6 | `application*.yml` support (the project uses `.properties`) |

### Test stack

| Tool | Version | Notes |
|---|---|---|
| JUnit | Jupiter **6.0.3** | |
| Spring Boot test modules | 4.1.1 | `spring-boot-starter-{data-jpa,security,validation,webmvc}-test` — the Boot 4 split, one per technology |
| Spring Test | 7.0.9 | `MockMvc`, `MockHttpServletRequest` |
| Mockito | 5.23.0 | + `mockito-junit-jupiter`; emits a JDK 25 self-attach warning |
| AssertJ | 3.27.7 | fluent assertions |
| Hamcrest | 3.0 | |
| JSONAssert / JsonPath | 1.5.3 / 2.10.0 | `jsonPath(...)` response assertions |
| XMLUnit | 2.11.0 | |
| Awaitility | 4.3.0 | async/concurrency tests |
| JSONassert android-json | 0.0.20131108 | transitive |

**There is no Testcontainers dependency.** The three `*IntegrationTest` classes
are annotated `@SpringBootTest` and run against the **real local
`shopstack_db`**, not a disposable container. Consequence: they call
`deleteAllInBatch()` on the warehouse tables, so `.\mvnw.cmd test` **destroys the
seeded data**. Re-run the V3 inserts (see the smoke test below) to restore it —
Flyway will not re-execute an already-recorded migration version.

### Runtime dependencies to know about

- **Nothing is containerised.** No Docker, Redis, or Kafka is used by the app.
  `infra/docker/docker-compose.yml` exists but only its Postgres service is
  relevant, and even that is optional.
- No OpenAPI/Swagger, no MapStruct, no Lombok-`-config`, no Redis, no Kafka,
  no message broker, no actuator/observability stack, no rate limiting.

### Toolchain summary

```
Java 17 target (JDK 25 runtime) · Maven 3.9.16 (wrapper) · Spring Boot 4.1.1
Spring Framework 7.0.9 · Spring Security 7.1.1 · Spring Data JPA 4.1.1
Hibernate ORM 7.4.5 · Hibernate Validator 9.1.3 · PostgreSQL 18 + JDBC 42.7.13
Flyway 12.4.0 · JJWT 0.12.6 · Jackson 3 (tools.jackson) 3.1.5
Lombok 1.18.46 · Logback 1.5.38 · JUnit Jupiter 6.0.3 · Mockito 5.23.0
Tomcat 11.0.24 · HikariCP 7.0.2
```

---

## 2. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| JDK | 17+ | `JAVA_HOME` must point at the install |
| Maven | bundled | use `mvnw.cmd` (Windows) / `./mvnw` |
| PostgreSQL | 15+ | Docker or a local install; this machine has **18** (`postgresql-x64-18`, port 5432) |

This machine already has JDK 25 at `C:\Program Files\Java\jdk-25.0.2` and a
local PostgreSQL 18 service on port `5432`. `JAVA_HOME` is set user-wide; open a
new terminal for it to take effect.

### 3. Start PostgreSQL

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

### 4. Configure environment

Copy `.env.example` to `.env` (git-ignored) or export the variables in your
shell. See `application.properties` for the `${...}` placeholders.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DB_PASSWORD` | yes | — | PostgreSQL password |
| `JWT_SECRET` | no | dev-only insecure value | HMAC signing key, **≥ 32 bytes** |
| `CORS_ORIGINS` | no | `http://localhost:5173` | comma-separated allowed frontend origins |
| `app.jwt.dev-token-endpoint-enabled` | no | `false` | registers `POST /api/auth/dev-token` |

The quickest local setup is the `local` profile, which supplies a dev DB
password and enables the dev-token endpoint:

```properties
# src/main/resources/application-local.properties
spring.datasource.password=${DB_PASSWORD:postgrespassword}
app.jwt.dev-token-endpoint-enabled=true
```

### 5. Run

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

Port **8080**. Run the tests (needs the database up and `DB_PASSWORD` set):

```powershell
$env:DB_PASSWORD="postgrespassword"
.\mvnw.cmd test
```

Current suite: **29 tests across 5 classes, all passing** —
`GlobalExceptionHandlerTest` (4), `WarehouseAuthorizationIntegrationTest` (9),
`ShopstackApplicationTests` (1), `WarehouseInventoryEnrichmentIntegrationTest` (2),
`WarehouseReceiveAsnIntegrationTest` (13).

---

## 6. Warehouse module

Package: `com.shopstack.warehouse` (`controller`, `service`, `repository`,
`entity`, `dto`, `port`). Security is in `com.shopstack.security.jwt`.

### Architecture: ports for cross-module reads

The warehouse module never imports another module's internals. It declares the
interfaces and the owning module supplies an implementation:

| Port | Reads | Stub |
|---|---|---|
| `ProductCataloguePort` | SKU → name, variant, category, image | `StubProductCataloguePort` |
| `VendorPort` | vendor id → name, GSTIN, contact | `StubVendorPort` |
| `OrderSummaryPort` | order counts by status, due-today | `StubOrderSummaryPort` |

The stubs keep the module demoable while `product` / `vendor` / `order` are
empty. When those modules land, the stubs are replaced and only the port
signatures matter.

### Authentication

Every `/api/warehouses/**` route requires a `Bearer` JWT with a `WAREHOUSE_STAFF`
role and a `warehouseId` claim. A token may only access its own warehouse;
requesting another returns **403** (`WarehouseAccessGuard`). Missing/invalid
token returns **401**. Unauthenticated and forbidden responses are written as
`{"message": "..."}` by `SecurityConfig`, not by the exception handler.

Public routes: `POST /api/auth/login`, `/register`, `/refresh` (reserved for the
auth team), `OPTIONS /**`, `/error`, and — **only when
`app.jwt.dev-token-endpoint-enabled=true`** — `POST /api/auth/dev-token`.

Mint a dev token while the real login flow does not exist:

```powershell
$body = Invoke-RestMethod -Method Post `
  "http://localhost:8080/api/auth/dev-token?warehouseId=WH-NORTH&role=WAREHOUSE_STAFF"
$token = $body.accessToken
$H = @{ Authorization = "Bearer $token" }
```

`DevTokenController` is `@ConditionalOnProperty`, so with the flag off the bean
does not exist and the route **404s** rather than merely refusing. Do not enable
it anywhere reachable from real users. It is scaffolding to be deleted once the
auth team's login flow lands, along with `JwtUtil.generate`.

### Endpoints

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/api/auth/me` | warehouse context for the logged-in user |
| 2 | GET | `/api/warehouses/{warehouseId}/inventory` | inventory rows, enriched with product data |
| 3 | GET | `/api/warehouses/{warehouseId}/bins` | storage bins grouped by zone |
| 4 | GET | `/api/warehouses/{warehouseId}/inbound` | inbound ASNs, enriched with vendor data |
| 5 | POST | `/api/warehouses/{warehouseId}/inbound/{id}/receive` | put away an ASN — body `{"bin":"B-01-04"}` |
| 6 | GET | `/api/warehouses/{warehouseId}/movements` | stock movements, newest first |
| 7 | GET | `/api/warehouses/{warehouseId}/orders/summary` | order counts by status |

`{warehouseId}` is a string code such as `WH-NORTH`, not a numeric id.

Receive is transactional (`Isolation.READ_COMMITTED` + pessimistic row lock): on
success it upserts the inventory row, clears empty rows of the same SKU in other
bins, marks the ASN received, and records a `Putaway` movement. Re-receiving
returns **409**, an unknown bin **422**, an unknown shipment **404**.

### Error contract

All errors are `{"message": "..."}` via `GlobalExceptionHandler`:

| Status | Exception | When |
|---|---|---|
| 404 | `ResourceNotFoundException` | unknown shipment / warehouse / bin |
| 409 | `ConflictException` | shipment already received, concurrent receive loses |
| 422 | `UnprocessableException` | invalid bin, SKU not in catalogue |
| 400 | `MethodArgumentNotValidException` | bean-validation failure |
| 500 | any other | body is always `"Internal server error"` — no stack traces leak |
| 401 / 403 | — | written directly by `SecurityConfig` |

### Database (Flyway, `src/main/resources/db/migration`)

| Version | File | Contents |
|---|---|---|
| V2 | `V2__create_warehouse_tables.sql` | `warehouses`, `warehouse_bins`, `inbound_shipments`, `inventory_rows`, `stock_movements`, sequence `mov_seq` (starts 5001) |
| V3 | `V3__seed_warehouse_bins.sql` | dev seed: `WH-NORTH` / `WH-SOUTH`, bins, two pending ASNs |

> The integration tests run against this same local database and call
> `deleteAllInBatch()` on the warehouse tables, so running `.\mvnw.cmd test`
> deletes the seeded ASNs. Re-run the V3 INSERT statements (or the smoke test
> below) to restore them — Flyway will not re-execute an already-recorded
> version.

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
`frontend/src/warehouse/services/http.js` so the `Authorization` header is sent.

---

## 7. Project layout

```
backend/
├── src/main/java/com/shopstack/
│   ├── ShopstackApplication.java
│   ├── warehouse/
│   │   ├── controller/   # Inventory, Inbound, Dashboard
│   │   ├── service/      # Inbound, Inventory, Movement, OrderSummary,
│   │   │                 #   WarehouseService, WarehouseAccessGuard
│   │   ├── repository/   # Spring Data JPA
│   │   ├── entity/       # Warehouse, WarehouseBin, InboundShipment,
│   │   │                 #   InventoryRow, StockMovement
│   │   ├── dto/          # request/ + response/ records
│   │   └── port/         # ProductCatalogue, Vendor, OrderSummary + Stubs
│   ├── auth/
│   │   ├── controller/   # AuthController, DevTokenController
│   │   ├── dto/          # WarehouseProfileDto
│   │   └── service/      # AuthService
│   ├── security/jwt/     # JwtUtil, JwtFilter, JwtAuthenticationToken
│   ├── common/
│   │   ├── enums/        # OrderStatus
│   │   ├── exception/    # ResourceNotFound, Conflict, Unprocessable
│   │   ├── response/     # ApiResponse, GlobalExceptionHandler
│   │   └── util/         # IdGenerator
│   └── config/           # SecurityConfig, CorsConfig
├── src/main/resources/
│   ├── application.properties
│   ├── application-local.properties
│   └── db/migration/     # Flyway V2, V3
├── src/test/java/com/shopstack/
│   ├── common/response/  # GlobalExceptionHandlerTest
│   ├── security/         # WarehouseAuthorizationIntegrationTest
│   └── warehouse/        # WarehouseInventoryEnrichmentIntegrationTest,
│                         #   WarehouseReceiveAsnIntegrationTest
├── .env.example          # environment template
├── mvnw / mvnw.cmd       # Maven wrapper 3.9.16
└── pom.xml
```

### Empty (placeholder) modules

`admin`, `analytics`, `cart`, `coupon`, `customer`, `inventory`, `notification`,
`order`, `payment`, `product`, `shipping`, `vendor` — each holds only
`.gitkeep` files.

### Known gaps

- `OrderStatus` (`common/enums`) is missing `CANCELLED` and
  `OUT_FOR_DELIVERY` relative to the shared status enum in the API contracts.
  Needed before the customer-side Order Desk / Pickup / Packup work lands.
- `docs/` is git-ignored (`.gitignore` line 37), so the API contracts and the
  implementation plan are untracked and do not reach teammates via a clone.
- `.gitignore` lists `.env` twice (lines 3 and 38) — harmless, worth tidying.
- The `local` profile enables the dev-token endpoint. Never activate that
  profile in a deployed environment.
