<<<<<<< HEAD
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { loadProducts } from "./store/productsSlice";
import { loadCart } from "./store/cartSlice";
import { loadWishlist } from "./store/wishlistSlice";
import { isLoggedIn } from "./customer/services/authService";
import CustomerRoutes from "./customer/routes/CustomerRoutes";
import Toast from "./customer/components/Toast";

// Loads the data from the backend when the site opens.
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
      <CustomerRoutes />
      <Toast />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
=======
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import CustomerRoutes from './customer/routes/CustomerRoutes';
import WarehouseRoutes from './warehouse/routes/WarehouseRoutes';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/warehouse/*" element={<WarehouseRoutes />} />
          <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
>>>>>>> origin/warehouse-module
      </BrowserRouter>
    </Provider>
  );
}
<<<<<<< HEAD

export default App;
=======
>>>>>>> origin/warehouse-module
