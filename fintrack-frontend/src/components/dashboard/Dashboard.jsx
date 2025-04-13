// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchDashboardData } from './Api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    recentTransactions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || 'User'}</h1>

      <div className="summary-cards">
        <div className="card">
          <h2>Current Balance</h2>
          <p className="amount">${dashboardData.balance.toFixed(2)}</p>
        </div>
        <div className="card">
          <h2>Total Income</h2>
          <p className="amount income">${dashboardData.income.toFixed(2)}</p>
        </div>
        <div className="card">
          <h2>Total Expenses</h2>
          <p className="amount expense">${dashboardData.expenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        {dashboardData.recentTransactions.length === 0 ? (
          <p>No recent transactions found.</p>
        ) : (
          <ul>
            {dashboardData.recentTransactions.map(transaction => (
              <li key={transaction._id} className={transaction.type}>
                <span className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <span className="transaction-category">{transaction.category}</span>
                <span className="transaction-amount">
                  ${transaction.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/transactions" className="view-all">View All Transactions</Link>
      </div>

      <div className="quick-actions">
        <Link to="/transactions/add" className="btn btn-primary">Add Transaction</Link>
        <Link to="/budgets" className="btn btn-secondary">Manage Budgets</Link>
        <Link to="/reports" className="btn btn-secondary">View Reports</Link>
      </div>
    </div>
  );
};

export default Dashboard;