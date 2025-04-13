// TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTransaction, createTransaction, updateTransaction } from './Api';

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Common expense categories
  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Housing', 'Utilities',
    'Entertainment', 'Shopping', 'Health & Fitness', 'Education',
    'Personal Care', 'Travel', 'Gifts & Donations', 'Other'
  ];

  // Common income categories
  const incomeCategories = [
    'Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds',
    'Rental Income', 'Side Business', 'Other'
  ];

  useEffect(() => {
    if (isEditMode) {
      const loadTransaction = async () => {
        try {
          setIsLoading(true);
          const transaction = await fetchTransaction(id);
          setFormData({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            date: new Date(transaction.date).toISOString().split('T')[0]
          });
        } catch (err) {
          setError('Failed to load transaction data');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      loadTransaction();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Form validation
      if (!formData.amount || !formData.description || !formData.category || !formData.date) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEditMode) {
        await updateTransaction(id, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      navigate('/transactions');
    } catch (err) {
      setError('Failed to save transaction');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) return <div className="loading">Loading transaction...</div>;

  return (
    <div className="transaction-form">
      <h1>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <div className="transaction-type-selector">
            <label className={`type-option ${formData.type === 'expense' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
              />
              Expense
            </label>
            <label className={`type-option ${formData.type === 'income' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
              />
              Income
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this transaction for?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <div className="category-input">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {formData.type === 'expense'
                ? expenseCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                : incomeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
              }
              <option value="custom">Add custom category</option>
            </select>

            {formData.category === 'custom' && (
              <input
                type="text"
                id="customCategory"
                name="category"
                value=""
                onChange={handleChange}
                placeholder="Enter custom category"
                required
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Transaction' : 'Add Transaction')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;