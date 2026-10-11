# Frontend connected to the backend API

The website no longer uses dummy data. Everything is saved in the database
through Varsha's API (branch `customer-testing`).

## Run it

1. Start PostgreSQL and the backend (port 8081):
   `cd backend` then `.\mvnw.cmd spring-boot:run`
2. Add the products once (needs the backend running):
   `node tools/seed-products.mjs`
3. Start the website:
   `npm install` then `npm run dev`  ->  open http://localhost:5173

Vite forwards every `/api/...` request to http://localhost:8081
(see `vite.config.js`), so there are no CORS problems while developing.
For a deployed site, set `VITE_API_BASE_URL` to the backend address.

## Where the API calls are

| Feature | File | Endpoints |
|---|---|---|
| Login, create account | `src/customer/services/authService.js` | POST /auth/login, POST /auth/register |
| Products | `src/customer/services/productService.js` | GET /products |
| Cart | `src/customer/services/cartService.js` | GET/POST/PUT/DELETE /customers/{id}/cart... |
| Wishlist | `src/customer/services/wishlistService.js` | GET/POST/DELETE /customers/{id}/wishlist... |
| Order and payment | `src/customer/services/orderService.js` | POST /customers/{id}/orders, POST /payments, POST /payments/{id}/process |
| Token + errors | `src/shared/api/client.js` | adds the login token, shows server messages |

## What needs the backend (Varsha)

- `GET /products` must be public (no login), or visitors cannot see products.
- Cart quantity: `PUT /customers/{id}/cart/items/{productId}` with `{"quantity": n}`.
  Until it exists, the + and - buttons remove and re-add the item (it still works).
- Product response: `oldPrice`, `averageRating`, `totalReviews` (old price, discount
  and stars are hidden until the API sends them), and `imageUrl` in cart items.

## Test checklist

1. Products appear on Home, Products and Deals (loaded from the database).
2. Create account -> goes to Sign In (not logged in yet) -> sign in -> back to where you were.
3. Heart and Add to Cart save in the database (check with GET in Postman, or refresh the page).
4. Cart: + / - / Remove change the database. Going over the stock shows the server's message.
5. Checkout -> Payment -> "Order placed". The order appears in the database and the cart is empty.
6. Logout, then open /cart -> goes to Sign In.
