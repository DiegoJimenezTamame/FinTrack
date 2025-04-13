// src/components/Transaction/TransactionList.js
import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../../services/TransactionService';
import TransactionForm from './TransactionForm';
import './TransactionList.css';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(transaction => transaction.id !== id));
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError("Failed to delete transaction. Please try again later.");
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleFormSubmit = () => {
    setEditingTransaction(null);
    fetchTransactions();
  };

  if (isLoading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="transaction-list-container">
      {editingTransaction ? (
        <div className="edit-form">
          <h3>Edit Transaction</h3>
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditingTransaction(null)}
          />
        </div>
      ) : (
        <>
          <h3>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p>No transactions found. Add one to get started!</p>
          ) : (
            <div className="transaction-list">
              {transactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-info">
                    <div className="transaction-primary">
                      <span className="transaction-category">{transaction.category}</span>
                      <span className="transaction-amount">
                        {transaction.type === 'income' ? '+' : '-'}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="transaction-secondary">
                      <span className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      <span className="transaction-description">{transaction.description}</span>
                    </div>
                  </div>
                  <div className="transaction-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionList;