import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import HomePage from './features/customer/pages/HomePage.jsx';
import SearchResultsPage from './features/customer/pages/SearchResultsPage.jsx';
import WishlistPage from './features/customer/pages/WishlistPage.jsx';
import CartPage from './features/customer/pages/CartPage.jsx';
import VendorDashboard from './features/vendor/VendorDashboard';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CategoryProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/vendor" element={<VendorDashboard />} />
          </Routes>
        </CategoryProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;