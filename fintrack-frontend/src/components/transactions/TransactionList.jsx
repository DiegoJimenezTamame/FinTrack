// TransactionList.jsx
import React, { useState, useEffect } from 'react';
import { fetchTransactions, deleteTransaction } from './Api';
import { Link } from 'react-router-dom';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    type: 'all',
    startDate: '',
    endDate: '',
    category: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTransactions(filter);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(t => t._id !== id));
      } catch (err) {
        setError('Failed to delete transaction');
        console.error(err);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadTransactions();
  };

  if (isLoading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transaction-list">
      <h1>Transactions</h1>

      <div className="filters">
        <form onSubmit={applyFilters}>
          <div className="filter-group">
            <label>
              Type:
              <select
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label>
              From:
              <input
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              To:
              <input
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              Category:
              <input
                type="text"
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                placeholder="Category"
              />
            </label>

            <button type="submit">Apply Filters</button>
          </div>
        </form>
      </div>

      <Link to="/transactions/add" className="btn btn-primary add-transaction">
        Add New Transaction
      </Link>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id} className={transaction.type}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td className="amount">${transaction.amount.toFixed(2)}</td>
                <td>{transaction.type}</td>
                <td className="actions">
                  <Link to={`/transactions/edit/${transaction._id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;