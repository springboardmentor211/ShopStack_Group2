import axios from 'axios';

// Backend Base URL (Server run avthunna port/URL ikkada evvali)
const API_BASE_URL = 'http://localhost:8080/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Fetch Products
export const getProducts = () => api.get('/products');

// 2. Add New Product
export const addProduct = (productData) => api.post('/products', productData);

// 3. Delete Product
export const deleteProduct = (id) => api.delete(`/products/${id}`);