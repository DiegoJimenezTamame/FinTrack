// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { getTransactionStats } from '../services/transactionService';
import Chart from '../components/Chart/Chart';
import TransactionList from '../components/Transaction/TransactionList';
import TransactionForm from '../components/Transaction/TransactionForm';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expense: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactionStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to load financial statistics. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    fetchStats();
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <button 
          className="add-transaction-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="add-transaction-form">
          <h2>Add New Transaction</h2>
          <TransactionForm onSubmit={handleTransactionAdded} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="stats-summary">
        <div className="stat-card balance">
          <h3>Balance</h3>
          <p className="stat-amount">${isLoading ? '...' : stats.balance.toFixed(2)}</p>
        </div>
        <div className="stat-card income">
          <h3>Income</h3>
          <p className="stat-amount">${isLoading ? '...' : stats.income.toFixed(2)}</p>
        </div>
        <div className="stat-card expense">
          <h3>Expenses</h3>
          <p className="stat-amount">${isLoading ? '...' : stats.expense.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="chart-section">
          <Chart />
        </div>
        
        <div className="transactions-section">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;