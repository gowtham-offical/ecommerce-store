/* =========================================================
   api.js — Central place for all fetch() calls to the backend.
   Change API_BASE_URL if your backend runs on a different host/port.
   ========================================================= */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic request helper. Automatically attaches the JWT token
 * (if present in localStorage) and parses JSON responses.
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // Some responses may not have a JSON body
    data = null;
  }

  if (!response.ok) {
    const message = (data && data.message) || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

/* ---------- Product API ---------- */
const ProductAPI = {
  getAll: (query = '') => apiRequest(`/products${query}`),
  getById: (id) => apiRequest(`/products/${id}`)
};

/* ---------- Auth API ---------- */
const AuthAPI = {
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

/* ---------- Order API ---------- */
const OrderAPI = {
  create: (items) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ items })
    }),
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`)
};
