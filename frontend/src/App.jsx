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
      </BrowserRouter>
    </Provider>
  );
}

export default App;
