# ShopStack Backend

Spring Boot backend for the ShopStack multi-vendor e-commerce platform. The
**warehouse module** is implemented end-to-end and covers two surfaces:

- **Inbound & inventory** — inbound ASNs, putaway, inventory, stock movements, and the
  order summary dashboard.
- **Customer-side fulfilment** — the **Order Desk**, **Pickup** and **Packup** services
  (12 endpoints) that take a confirmed order through pick → pack → ship.

Plus **JWT auth and warehouse scoping** across all of it. Other modules (`product`,
`vendor`, `order`, `customer`, `admin`, `cart`, `payment`, `shipping`, `coupon`,
`notification`, `analytics`) are empty scaffolding that the warehouse module reaches
only through port interfaces.

---

## 0. Context & design decisions

Recorded so the next person does not re-litigate them.

| # | Decision | Why |
|---|---|---|
| 1 | Warehouse ids are `String` (`WH-NORTH`), not numeric | matches the API contract and the frontend mocks |
| 2 | Inbound/ASN ids are `String` prefixed `ASN-` | contract-visible format |
| 3 | Movement ids are `String` prefixed `MOV-`, from a DB sequence | `mov_seq` starts at 5001; `IdGenerator` formats `MOV-%04d` |
| 4 | `receiveAsn` is concurrency-guarded and returns `409` on conflict | two staff can click Receive on the same ASN at once |
| 5 | `/api/auth/me` lives in `auth`, not `warehouse` | the warehouse team supplies the endpoint *shape*; the auth team owns the `User`/role table |
| 6 | `common.exception` / `common.response` / `common.enums` are defined once, here | the warehouse team landed them first so other modules adopt rather than duplicate |
| 7 | `jjwt` for tokens | coordinate with the security owner before changing this |
| 8 | Each Flyway migration is isolated and additive | the warehouse team owns `V2`–`V5`; another module claiming `V6` must not need to touch ours |
| 9 | **The `order` module owns `order.status`; warehouse owns only floor state** | `order_pick_items` and `order_packings` are warehouse rows; everything order-shaped goes through `OrderFulfillmentPort`. Every transition uses the guarded `advanceStatus(from, to)` |
| 10 | The shared status enum is `pending → confirmed → picked → packed → shipped → out_for_delivery → delivered`, plus `cancelled` | wider than the original 7-value list — `CANCELLED` and `OUT_FOR_DELIVERY` both exist, and the dashboard pipeline counts the same set |
| 11 | **Stock leaves the bin at pick, not at ship** | completing a pick decrements `inventory_rows` and writes a `Pick` movement; shipping writes nothing. One movement log, and `movements` reads as a single chronological feed |
| 12 | Single branch, story id in the commit message | story boundaries are commit boundaries, and each commit must leave `mvn test` green so the branch stays bisectable |

Decision 9 is the load-bearing one. Because the warehouse module cannot write
`order.status` directly, Order Desk, Pickup, Packup and the dashboard physically
cannot hold divergent copies of it — that is the property worth protecting when
reviewing changes here.

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

**There is no Testcontainers dependency.** The `*IntegrationTest` classes are
annotated `@SpringBootTest` and run against the **real local `shopstack_db`**, not a
disposable container. Consequence: they call `deleteAllInBatch()` on the warehouse
tables, so `.\mvnw.cmd test` **destroys the seeded data**. Re-run the V3 inserts (see
the smoke test below) to restore it — Flyway will not re-execute an
already-recorded migration version.

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

Current suite: **85 tests across 9 classes, all passing**.

| Test class | Tests |
|---|---|
| `GlobalExceptionHandlerTest` | 4 |
| `WarehouseAuthorizationIntegrationTest` | 9 |
| `ShopstackApplicationTests` | 1 |
| `WarehouseInventoryEnrichmentIntegrationTest` | 2 |
| `WarehouseReceiveAsnIntegrationTest` | 13 |
| `WarehouseOrderDeskIntegrationTest` | 12 |
| `WarehousePickupIntegrationTest` | 11 |
| `WarehousePackupIntegrationTest` | 13 |
| `WarehouseScopeIntegrationTest` | 12 |
| `ContractShapeTest` | 8 |

---

## 6. Warehouse module

Package: `com.shopstack.warehouse` (`controller`, `service`, `repository`,
`entity`, `dto`, `port`, `dev`). Security is in `com.shopstack.security.jwt`.

### Architecture: ports for cross-module reads

The warehouse module never imports another module's internals. It declares the
interfaces and the owning module supplies an implementation:

| Port | Reads / writes | Stub |
|---|---|---|
| `ProductCataloguePort` | SKU → name, variant, category, image | `StubProductCataloguePort` |
| `VendorPort` | vendor id → name, GSTIN, contact | `StubVendorPort` |
| `OrderFulfillmentPort` | order header, lines, **and every status write** | `StubOrderFulfillmentPort` |

The stubs keep the module demoable while `product` / `vendor` / `order` are
empty. When those modules land, the stubs are replaced and only the port
signatures matter.

### `OrderFulfillmentPort` — the single path to order state

`order.status` is owned by the `order` module. The warehouse module keeps only
*floor* state (`order_pick_items`, `order_packings`) and reads or writes everything
else through this one port:

```java
List<OrderRecord> findOrders(String warehouseId, OrderStatus status, int page, int pageSize);
Optional<OrderRecord> findOrder(String warehouseId, String orderId);
List<OrderItemRecord> findItems(String warehouseId, String orderId);
OrderRecord confirm(String warehouseId, String orderId, LocalDate deliveryDate);
OrderRecord cancel(String warehouseId, String orderId);
OrderRecord advanceStatus(String warehouseId, String orderId, OrderStatus from, OrderStatus to);
Map<OrderStatus, Integer> countByStatus(String warehouseId);
int countDueToday(String warehouseId);
```

Two consequences worth knowing before you touch it:

- **`advanceStatus(from, to)` is the only status write.** Order Desk confirm/cancel,
  Pickup complete, Packup pack and ship all funnel through it, so the
  `from → to` legality guard lives in exactly one place. Bypassing it by writing
  `order.status` directly reintroduces the divergent-copy bug the port exists to
  prevent.
- **`countByStatus` also feeds the dashboard.** `OrderSummaryService` reads the same
  map the Order Desk list reads, so the pipeline counts and the order list cannot
  disagree.

> ⚠️ **`StubOrderFulfillmentPort` is an unconditional `@Component`, not
> `@Profile`-gated.** It is backed by the `dev_orders` / `dev_order_items` tables
> from V5, so it will be picked up in a production context and will shadow the real
> `order`-module adapter once that exists. Gate it on `@Profile("dev"|"test")` (or
> `@ConditionalOnMissingBean(OrderFulfillmentPort.class)`) before this ships anywhere shared.

### Fulfilment status model

`OrderStatus` is shared via `common.enums`:

```
pending → confirmed → picked → packed → shipped → out_for_delivery → delivered
                                  ↘ (cancel from any pre-shipped state) ↙
                                                            cancelled
```

`PickStage` (`to_pick | picked | all`) and `PackStage`
(`to_pack | packed | ready_to_ship | shipped | all`) are the queue filters for the
Pickup and Packup screens. Stage ≠ status: `ready_to_ship` means `packed && !shipped`,
derived at read time from the packing row, never stored as an order status.

**Stock leaves the bin at pick, not at ship.** Completing a pick decrements
`inventory_rows` and writes one `Pick` movement per line; shipping writes no
movement at all. This is why un-picking a line does not return stock to the bin.

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

**Inbound, inventory and dashboard**

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/api/auth/me` | warehouse context for the logged-in user |
| 2 | GET | `/api/warehouses/{warehouseId}/inventory` | inventory rows, enriched with product data |
| 3 | GET | `/api/warehouses/{warehouseId}/bins` | storage bins grouped by zone |
| 4 | GET | `/api/warehouses/{warehouseId}/inbound` | inbound ASNs, enriched with vendor data |
| 5 | POST | `/api/warehouses/{warehouseId}/inbound/{id}/receive` | put away an ASN — body `{"bin":"B-01-04"}` |
| 6 | GET | `/api/warehouses/{warehouseId}/movements` | stock movements, newest first |
| 7 | GET | `/api/warehouses/{warehouseId}/orders/summary` | order counts by status |

**Customer-side fulfilment — Order Desk, Pickup, Packup**

| # | Method | Path | Description |
|---|---|---|---|
| 8 | GET | `/api/warehouses/{warehouseId}/orders` | order list — query `status`, `page`, `pageSize` |
| 9 | GET | `/api/warehouses/{warehouseId}/orders/{orderId}` | order detail with items and live bin/stock |
| 10 | POST | `/api/warehouses/{warehouseId}/orders/{orderId}/confirm` | body `{"deliveryDate":"2026-10-02"}` |
| 11 | POST | `/api/warehouses/{warehouseId}/orders/{orderId}/cancel` | no body |
| 12 | GET | `/api/warehouses/{warehouseId}/pickup` | pick queue — query `stage=to_pick\|picked\|all` |
| 13 | GET | `/api/warehouses/{warehouseId}/pickup/{orderId}` | pick list (seeds `order_pick_items` on first read) |
| 14 | POST | `/api/warehouses/{warehouseId}/pickup/{orderId}/item` | body `{"itemId":"ITEM-1","picked":true}` |
| 15 | POST | `/api/warehouses/{warehouseId}/pickup/{orderId}/complete` | no body — decrements stock, writes `Pick` movements |
| 16 | GET | `/api/warehouses/{warehouseId}/packup` | pack queue — query `stage=to_pack\|packed\|ready_to_ship\|shipped\|all` |
| 17 | GET | `/api/warehouses/{warehouseId}/packup/{orderId}` | pack detail; always carries `packing` + `outbound` |
| 18 | POST | `/api/warehouses/{warehouseId}/packup/{orderId}/pack` | body `{"boxSize":"medium","weightKg":0.8}` |
| 19 | POST | `/api/warehouses/{warehouseId}/packup/{orderId}/ship` | body `{"carrier":"BlueDart"}` → returns `trackingId` |

`{warehouseId}` is a string code such as `WH-NORTH`, not a numeric id.

Receive is transactional (`Isolation.READ_COMMITTED` + pessimistic row lock): on
success it upserts the inventory row, clears empty rows of the same SKU in other
bins, marks the ASN received, and records a `Putaway` movement. Re-receiving
returns **409**, an unknown bin **422**, an unknown shipment **404**.

### Fulfilment rules that are easy to get wrong

- **A valid order id from another warehouse is `404`, not `403`** — warehouse
  membership is not leaked. `403` is reserved for a path `{warehouseId}` that does
  not match the caller's token claim.
- **`order_pick_items` is seeded lazily on read**, and `toggleItem` seeds it too.
  Toggling a line therefore works whether or not the client fetched the pick list
  first; re-reading never resets a `picked` flag.
- **Pick completion locks before it validates.** `findByOrderIdWithLock` takes
  `PESSIMISTIC_WRITE` on every line and `findByWarehouseIdAndSkuForUpdate` locks the
  stock rows, so two pickers finishing the same order yield one `200` and one
  `409` rather than a double decrement.
- **Shipping generates the tracking id once.** A retry reuses the existing
  `tracking_id` instead of burning another `tracking_seq` value.
- **`cancelled` after a partial pick does not return stock** — the pick already
  decremented it. No compensating movement is written, by design.

### Error contract

All errors are `{"message": "..."}` via `GlobalExceptionHandler`. Message strings
are asserted byte-for-byte in the integration tests.

| Status | Exception | When |
|---|---|---|
| 404 | `ResourceNotFoundException` | unknown shipment / warehouse / bin / order / order line |
| 409 | `ConflictException` | shipment already received; order in the wrong status for the action; partial pick; insufficient stock |
| 422 | `UnprocessableException` | invalid bin, SKU not in catalogue, bad `deliveryDate` / `boxSize` / `weightKg` / carrier |
| 400 | `MethodArgumentNotValidException` | bean-validation failure |
| 500 | any other | body is always `"Internal server error"` — no stack traces leak |
| 401 / 403 | — | written directly by `SecurityConfig` |

Notable fulfilment messages:

| Endpoint | Status | Message |
|---|---|---|
| `POST /orders/{id}/confirm` | 409 | `This order has already been confirmed or cancelled.` |
| `POST /orders/{id}/cancel` | 409 | `This order can no longer be cancelled.` |
| `POST /orders/{id}/confirm` | 422 | `Choose a valid delivery date.` |
| `GET/POST /pickup/**` | 409 | `Order must be confirmed before picking.` |
| `POST /pickup/{id}/item` | 404 | `Item not found on this order.` |
| `POST /pickup/{id}/complete` | 409 | `Not all items have been picked.` |
| `POST /pickup/{id}/complete` | 409 | `Not enough stock in <bin> to complete this pick.` |
| `GET /packup/{id}` | 409 | `Order has not been picked yet.` |
| `POST /packup/{id}/pack` | 409 | `Order must be picked before packing.` |
| `POST /packup/{id}/pack` | 422 | `Enter a valid box size and weight.` |
| `POST /packup/{id}/ship` | 409 | `Order must be packed before shipping.` |
| `POST /packup/{id}/ship` | 422 | `Choose a carrier.` |

### Contract shape is enforced by test

`ContractShapeTest` serialises every response DTO and asserts the exact field-name
set, so renaming a record component fails CI rather than surfacing as `undefined`
in the browser. It also covers the three `ActionResultDto` variants — a pick toggle
emits `{"ok":true}`, pack emits `{"ok":true,"status":"packed"}`, and ship adds
`trackingId` — and the dashboard's `out_for_delivery` key, which is snake_case on
the wire and therefore cannot be a record component name.

### Database (Flyway, `src/main/resources/db/migration`)

The warehouse team owns `V2`–`V5`. Each script is isolated and additive; do not
edit one that Flyway has already recorded a checksum for.

| Script | Story | Contents |
|---|---|---|
| `V2__create_warehouse_tables.sql` | W-02 | `warehouses`, `warehouse_bins`, `inbound_shipments`, `inventory_rows`, `stock_movements`; sequence `mov_seq` starts 5001 |
| `V3__seed_warehouse_bins.sql` | W-12 | dev/test seed: `WH-NORTH` / `WH-SOUTH`, bins, two pending ASNs |
| `V4__create_fulfillment_tables.sql` | W-14 | `order_pick_items`, `order_packings`; sequence `tracking_seq` starts 2938471 |
| `V5__seed_dev_fulfillment_data.sql` | W-14 | dev/test seed: `dev_orders` / `dev_order_items`, backing `StubOrderFulfillmentPort` |

Schema notes that matter when reading the entities:

- `order_pick_items` has **no** `order_id` foreign key — `orders` is owned by the
  `order` module and reached through the port, so an FK would couple the two schemas.
- `order_packings` never stores `order.status`; packing and outbound facts only.
- `inventory_rows` is unique on `(warehouse_id, sku, bin)`. Upserts must find-or-create,
  never blind-insert.
- Both seed migrations (V3, V5) exist **only** to make the module demoable and testable
  locally. V5 and the `dev/` package should be deleted when the real
  `OrderFulfillmentPort` adapter lands.

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

### Fulfilment smoke test

Walks one confirmed order through the whole customer-side flow. Assumes the V5
dev seed is present.

```powershell
$body = Invoke-RestMethod -Method Post "http://localhost:8080/api/auth/dev-token?warehouseId=WH-NORTH&role=WAREHOUSE_STAFF"
$H    = @{ Authorization = "Bearer $($body.accessToken)" }
$B    = "http://localhost:8080/api/warehouses/WH-NORTH"

# Pickup queue → tick each line → complete
$order = (Invoke-RestMethod "$B/pickup?stage=to_pick" -Headers $H)[0].orderId
Invoke-RestMethod "$B/pickup/$order" -Headers $H | Select-Object -ExpandProperty pickList |
  ForEach-Object { Invoke-RestMethod -Method Post "$B/pickup/$order/item" -Headers $H `
      -ContentType "application/json" -Body "{`"itemId`":`"$($_.itemId)`",`"picked`":true}" }
Invoke-RestMethod -Method Post "$B/pickup/$order/complete" -Headers $H

# Packup → pack → ship
Invoke-RestMethod "$B/packup?stage=to_pack" -Headers $H | Select-Object -First 1
Invoke-RestMethod -Method Post "$B/packup/$order/pack" -Headers $H `
  -ContentType "application/json" -Body '{"boxSize":"medium","weightKg":0.8}'
Invoke-RestMethod -Method Post "$B/packup/$order/ship" -Headers $H `
  -ContentType "application/json" -Body '{"carrier":"BlueDart"}'
```

Expected: the order leaves the pickup queue and appears in packup; completing with
a line still unticked returns `409` with `Not all items have been picked.`; ship
returns `trackingId` shaped `BD-<digits>`; a `Pick` movement for each line shows
up in `GET /movements` alongside the `Putaway` rows; and `GET /orders/summary`
reflects the new status.

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

The Dashboard, Inventory, Receiving and Movement screens consume routes 1–7; Order
Desk, Pickup and Packup consume routes 8–19. `setAuthTokenGetter` must be wired in
all three customer-side screens — without it every call returns 401.

### End-to-end verification

Walks a single order through the whole flow against the running stack:

1. Order Desk → filter `pending` → confirm with tomorrow's date → the row moves to `confirmed`.
2. Pickup → open the order → tick one of two lines → **Complete** is blocked with the
   `409` `Not all items have been picked.` → tick the second → Complete succeeds → the
   order leaves the queue and appears in Packup.
3. Packup → pack with a bad weight → inline `422` → valid weight → ship → `trackingId`
   is shown.
4. Dashboard → reload: the pipeline reflects every transition, and the new `Pick`
   movements appear in the same feed as `Putaway`.
5. Confirm `order.status` is consistent across all three screens — there is one copy,
   in the `order` module, reached through `OrderFulfillmentPort`.

`ContractShapeTest` guards step 5's failure mode in CI: any field-name drift between
these DTOs and the frontend's expectations fails the backend build.

---

## 7. Project layout

```
backend/
├── src/main/java/com/shopstack/
│   ├── ShopstackApplication.java
│   ├── warehouse/
│   │   ├── controller/   # Inventory, Inbound, Dashboard,
│   │   │                 #   OrderDesk, Pickup, Packup
│   │   ├── service/      # Inbound, Inventory, Movement, OrderSummary,
│   │   │                 #   OrderDesk, Pickup, Packup,
│   │   │                 #   WarehouseService, WarehouseAccessGuard
│   │   ├── repository/   # Spring Data JPA
│   │   ├── entity/       # Warehouse, WarehouseBin, InboundShipment,
│   │   │                 #   InventoryRow, StockMovement,
│   │   │                 #   OrderPickItem, OrderPacking
│   │   ├── dto/          # request/ + response/ records
│   │   ├── port/         # ProductCatalogue, Vendor, OrderFulfillment + Stubs
│   │   │   └── dto/      #   OrderRecord, OrderItemRecord
│   │   └── dev/          # DevOrder, DevOrderItem + repos — backs the stub
│   ├── auth/
│   │   ├── controller/   # AuthController, DevTokenController
│   │   ├── dto/          # WarehouseProfileDto
│   │   └── service/      # AuthService
│   ├── security/jwt/     # JwtUtil, JwtFilter, JwtAuthenticationToken
│   ├── common/
│   │   ├── enums/        # OrderStatus, PickStage, PackStage
│   │   ├── exception/    # ResourceNotFound, Conflict, Unprocessable
│   │   ├── response/     # ApiResponse, GlobalExceptionHandler
│   │   └── util/         # IdGenerator (movement + tracking ids)
│   └── config/           # SecurityConfig, CorsConfig
├── src/main/resources/
│   ├── application.properties
│   ├── application-local.properties
│   └── db/migration/     # Flyway V2 – V5
├── src/test/java/com/shopstack/
│   ├── common/response/  # GlobalExceptionHandlerTest
│   ├── security/         # WarehouseAuthorizationIntegrationTest
│   └── warehouse/        # FulfillmentTestSupport (fixture),
│                         #   WarehouseInventoryEnrichmentIntegrationTest,
│                         #   WarehouseReceiveAsnIntegrationTest,
│                         #   WarehouseOrderDeskIntegrationTest,
│                         #   WarehousePickupIntegrationTest,
│                         #   WarehousePackupIntegrationTest,
│                         #   WarehouseScopeIntegrationTest,
│                         #   ContractShapeTest
├── .env.example          # environment template
├── mvnw / mvnw.cmd       # Maven wrapper 3.9.16
└── pom.xml
```

### Empty (placeholder) modules

`admin`, `analytics`, `cart`, `coupon`, `customer`, `inventory`, `notification`,
`order`, `payment`, `product`, `shipping`, `vendor` — each holds only
`.gitkeep` files.

### Known gaps

- **`StubOrderFulfillmentPort` is not `@Profile`-gated.** It is an unconditional
  `@Component`, so it will be active in every environment and will shadow the real
  `order`-module adapter. Gate it before deploying anywhere shared.
- The `local` profile enables the dev-token endpoint. Never activate that
  profile in a deployed environment.
- There is no Testcontainers setup, so the integration tests are destructive
  against a developer's real database. A disposable Postgres would make CI safe.
  Note the fulfilment fixture namespaces its rows with `T-` and deletes only those,
  so it does not disturb the warehouse seed data the way the older tests do.

---

## 8. API surface summary

Which controller and service owns each route.

| # | Method | Path | Controller | Service | Story |
|---|---|---|---|---|---|
| 1 | GET | `/api/auth/me` | `AuthController` | `WarehouseService` | W-09 |
| 2 | GET | `/api/warehouses/{wId}/inventory` | `WarehouseInventoryController` | `InventoryService` | W-03 |
| 3 | GET | `/api/warehouses/{wId}/inbound` | `WarehouseInboundController` | `InboundService` | W-04 |
| 4 | GET | `/api/warehouses/{wId}/bins` | `WarehouseInventoryController` | `InventoryService` | W-03 |
| 5 | POST | `/api/warehouses/{wId}/inbound/{id}/receive` | `WarehouseInboundController` | `InboundService` | W-05 |
| 6 | GET | `/api/warehouses/{wId}/movements` | `WarehouseInventoryController` | `MovementService` | W-06 |
| 7 | GET | `/api/warehouses/{wId}/orders/summary` | `WarehouseDashboardController` | `OrderSummaryService` | W-07 |
| 8 | GET | `/api/warehouses/{wId}/orders` | `WarehouseOrderDeskController` | `OrderDeskService` | W-15 |
| 9 | GET | `/api/warehouses/{wId}/orders/{orderId}` | `WarehouseOrderDeskController` | `OrderDeskService` | W-15 |
| 10 | POST | `/api/warehouses/{wId}/orders/{orderId}/confirm` | `WarehouseOrderDeskController` | `OrderDeskService` | W-16 |
| 11 | POST | `/api/warehouses/{wId}/orders/{orderId}/cancel` | `WarehouseOrderDeskController` | `OrderDeskService` | W-16 |
| 12 | GET | `/api/warehouses/{wId}/pickup` | `WarehousePickupController` | `PickupService` | W-17 |
| 13 | GET | `/api/warehouses/{wId}/pickup/{orderId}` | `WarehousePickupController` | `PickupService` | W-17 |
| 14 | POST | `/api/warehouses/{wId}/pickup/{orderId}/item` | `WarehousePickupController` | `PickupService` | W-18 |
| 15 | POST | `/api/warehouses/{wId}/pickup/{orderId}/complete` | `WarehousePickupController` | `PickupService` | W-18 |
| 16 | GET | `/api/warehouses/{wId}/packup` | `WarehousePackupController` | `PackupService` | W-19 |
| 17 | GET | `/api/warehouses/{wId}/packup/{orderId}` | `WarehousePackupController` | `PackupService` | W-19 |
| 18 | POST | `/api/warehouses/{wId}/packup/{orderId}/pack` | `WarehousePackupController` | `PackupService` | W-20 |
| 19 | POST | `/api/warehouses/{wId}/packup/{orderId}/ship` | `WarehousePackupController` | `PackupService` | W-20 |

Shared error contract for all of them: **404** not found · **409** wrong status for
the action · **422** invalid input · **403** wrong warehouse — with the exact
`message` strings listed in §10.

---

## 9. Reusable common components

**Defined once here, adopted by other modules — do not create duplicates.**

| Component | Package | Purpose |
|---|---|---|
| `OrderStatus` | `common.enums` | Shared order state enum; includes `CANCELLED` and `OUT_FOR_DELIVERY` |
| `PickStage` | `common.enums` | Pickup queue filter: `to_pick \| picked \| all` |
| `PackStage` | `common.enums` | Packup queue filter: `to_pack \| packed \| ready_to_ship \| shipped \| all` |
| `ResourceNotFoundException` | `common.exception` | Maps to HTTP 404 |
| `ConflictException` | `common.exception` | Maps to HTTP 409 |
| `UnprocessableException` | `common.exception` | Maps to HTTP 422 |
| `ApiResponse` | `common.response` | `{ "message": "..." }` error body |
| `GlobalExceptionHandler` | `common.response` | `@RestControllerAdvice` — the central HTTP mapping |
| `IdGenerator` | `common.util` | `MOV-` and `BD-` prefixed ids from DB sequences |

---

## 10. Appendix: error message reference

Strings are asserted byte-for-byte in the integration tests. **Do not paraphrase
them** — the frontend matches on them, and a reworded message is a breaking change.

### Inbound (W-05)

| HTTP | Message |
|---|---|
| 404 | `Shipment not found.` |
| 409 | `This shipment is already in inventory.` |
| 422 | `Choose a valid bin for this warehouse.` |
| 422 | `This product is not in the catalogue.` |

### Order Desk (W-15, W-16)

| HTTP | Message |
|---|---|
| 404 | `Order not found.` |
| 409 | `This order has already been confirmed or cancelled.` |
| 409 | `This order can no longer be cancelled.` |
| 422 | `Choose a valid delivery date.` |

### Pickup (W-17, W-18)

| HTTP | Message |
|---|---|
| 404 | `Order not found.` |
| 404 | `Item not found on this order.` |
| 409 | `Order must be confirmed before picking.` |
| 409 | `Not all items have been picked.` |
| 409 | `Not enough stock in <bin> to complete this pick.` |
| 422 | `Choose an item and whether it was picked.` |

### Packup (W-19, W-20)

| HTTP | Message |
|---|---|
| 404 | `Order not found.` |
| 409 | `Order has not been picked yet.` |
| 409 | `Order must be picked before packing.` |
| 409 | `Order must be packed before shipping.` |
| 422 | `Enter a valid box size and weight.` |
| 422 | `Choose a carrier.` |

### Scope — all warehouse routes

| HTTP | Message |
|---|---|
| 401 | `Authentication required.` |
| 403 | `You do not have access to this warehouse.` |

### Query parameter validation (422)

These interpolate the offending value, so they are the only messages that are not
byte-stable — the integration tests match the fixed prefix.

| HTTP | Message | Raised by |
|---|---|---|
| 404 | `Warehouse not found.` | `WarehouseService` |
| 422 | `Unknown status filter: <value>` | `OrderDeskService` |
| 422 | `Unknown pickup stage: <value>` | `PickupService` |
| 422 | `Unknown packup stage: <value>` | `PackupService` |

### Fallback

| HTTP | Message |
|---|---|
| 500 | `Internal server error` — always, regardless of the cause; no stack trace leaks |
