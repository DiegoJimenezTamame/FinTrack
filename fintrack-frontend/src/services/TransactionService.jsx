// src/services/TransactionService.jsx
import { 
  fetchTransactions, 
  createTransaction as apiCreateTransaction, 
  updateTransaction as apiUpdateTransaction, 
  deleteTransaction as apiDeleteTransaction, 
  fetchDashboardData 
} from './Api';

// Get all transactions
export const getTransactions = async () => {
  try {
    return await fetchTransactions();
  } catch (error) {
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (transaction) => {
  try {
    return await apiCreateTransaction(transaction);
  } catch (error) {
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (id, transaction) => {
  try {
    return await apiUpdateTransaction(id, transaction);
  } catch (error) {
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    return await apiDeleteTransaction(id);
  } catch (error) {
    throw error;
  }
};

// Get transaction statistics
export const getTransactionStats = async () => {
  try {
    return await fetchDashboardData();
  } catch (error) {
    throw error;
  }
};