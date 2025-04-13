import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication Service
export const AuthService = {
  register: (username, email, password) => {
    return api.post('/users/register', { username, email, password });
  },
  login: (username, password) => {
    const encodedAuth = btoa(`${username}:${password}`);
    localStorage.setItem('auth', encodedAuth);
    return api.get(`/users/username/${username}`, {
      headers: {
        Authorization: `Basic ${encodedAuth}`,
      },
    });
  },
  logout: () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Add authentication header to every request
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      config.headers.Authorization = `Basic ${auth}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Category Service
export const CategoryService = {
  getCategories: (userId) => {
    return api.get(`/categories/user/${userId}`);
  },
  getCategoriesByType: (userId, type) => {
    return api.get(`/categories/user/${userId}/type/${type}`);
  },
  createCategory: (userId, categoryData) => {
    return api.post(`/categories/user/${userId}`, categoryData);
  },
  updateCategory: (categoryId, categoryData) => {
    return api.put(`/categories/${categoryId}`, categoryData);
  },
  deleteCategory: (categoryId) => {
    return api.delete(`/categories/${categoryId}`);
  },
};

// Account Service
export const AccountService = {
  getAccounts: (userId) => {
    return api.get(`/accounts/user/${userId}`);
  },
  createAccount: (userId, accountData) => {
    return api.post(`/accounts/user/${userId}`, accountData);
  },
  updateAccount: (accountId, accountData) => {
    return api.put(`/accounts/${accountId}`, accountData);
  },
  deleteAccount: (accountId) => {
    return api.delete(`/accounts/${accountId}`);
  },
};

// Transaction Service
export const TransactionService = {
  getTransactions: (userId) => {
    return api.get(`/transactions/user/${userId}`);
  },
  getTransactionsByType: (userId, type) => {
    return api.get(`/transactions/user/${userId}/type/${type}`);
  },
  getTransactionsByDateRange: (userId, startDate, endDate) => {
    return api.get(`/transactions/user/${userId}/daterange`, {
      params: { startDate, endDate },
    });
  },
  createTransaction: (userId, transactionData) => {
    return api.post(`/transactions/user/${userId}`, transactionData);
  },
  updateTransaction: (transactionId, transactionData) => {
    return api.put(`/transactions/${transactionId}`, transactionData);
  },
  deleteTransaction: (transactionId) => {
    return api.delete(`/transactions/${transactionId}`);
  },
};

export default api;