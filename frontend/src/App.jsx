import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { loadProducts } from "./store/productsSlice";
import { loadCart } from "./store/cartSlice";
import { loadWishlist } from "./store/wishlistSlice";
import { isLoggedIn } from "./customer/services/authService";
import CustomerRoutes from "./customer/routes/CustomerRoutes";
import Toast from "./customer/components/Toast";
import WarehouseRoutes from "./warehouse/routes/WarehouseRoutes";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts());
    if (isLoggedIn()) {
      dispatch(loadCart());
      dispatch(loadWishlist());
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/warehouse/*" element={<WarehouseRoutes />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}
