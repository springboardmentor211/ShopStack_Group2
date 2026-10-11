import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Deals from "../pages/Deals";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Login from "../pages/Login";
import AccountType from "../pages/AccountType";
import Signup from "../pages/Signup";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import RequireLogin from "../components/RequireLogin";

const CustomerRoutes = () => {
  return (
    <Routes>
      {/* Public: anyone can browse */}
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/deals" element={<Deals />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<AccountType />} />

      <Route path="/signup/details" element={<Signup />} />

      {/* Login required */}
      <Route
        path="/cart"
        element={
          <RequireLogin>
            <Cart />
          </RequireLogin>
        }
      />

      <Route
        path="/wishlist"
        element={
          <RequireLogin>
            <Wishlist />
          </RequireLogin>
        }
      />

      <Route
        path="/checkout"
        element={
          <RequireLogin>
            <Checkout />
          </RequireLogin>
        }
      />

      <Route
        path="/payment"
        element={
          <RequireLogin>
            <Payment />
          </RequireLogin>
        }
      />
    </Routes>
  );
};

export default CustomerRoutes;
