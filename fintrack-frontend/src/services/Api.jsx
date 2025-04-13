// Api.jsx
import axios from 'axios';

// Set base URL for all API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Transaction API calls
export const fetchTransactions = async (filters = {}) => {
  const response = await apiClient.get('/transactions', { params: filters });
  return response.data;
};

export const fetchTransaction = async (id) => {
  const response = await apiClient.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await apiClient.post('/transactions', transactionData);
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await apiClient.put(`/transactions/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await apiClient.delete(`/transactions/${id}`);
  return response.data;
};

// Dashboard API calls
export const fetchDashboardData = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};

// Budget API calls
export const fetchBudgets = async () => {
  const response = await apiClient.get('/budgets');
  return response.data;
};

export const fetchBudget = async (id) => {
  const response = await apiClient.get(`/budgets/${id}`);
  return response.data;
};

export const createBudget = async (budgetData) => {
  const response = await apiClient.post('/budgets', budgetData);
  return response.data;
};

export const updateBudget = async (id, budgetData) => {
  const response = await apiClient.put(`/budgets/${id}`, budgetData);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await apiClient.delete(`/budgets/${id}`);
  return response.data;
};

// Error handler helper
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data.message || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'No response from server. Please check your connection.',
      status: null
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'An unknown error occurred',
      status: null
    };
  }
};