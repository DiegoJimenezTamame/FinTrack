// BudgetForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBudget, createBudget, updateBudget } from '../../services/Api';

const BudgetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' // default period
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const loadBudget = async () => {
        try {
          setIsLoading(true);
          const budget = await fetchBudget(id);
          setFormData({
            category: budget.category,
            amount: budget.amount,
            period: budget.period
          });
          setError(null);
        } catch (err) {
          setError('Failed to load budget data');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      loadBudget();
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

      // Validate form data
      if (!formData.category || !formData.amount) {
        setError('Please fill in all required fields');
        return;
      }

      if (isEditMode) {
        await updateBudget(id, formData);
      } else {
        await createBudget(formData);
      }

      navigate('/budgets');
    } catch (err) {
      setError('Failed to save budget');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) return <div className="loading">Loading budget...</div>;

  return (
    <div className="budget-form">
      <h1>{isEditMode ? 'Edit Budget' : 'Create New Budget'}</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Groceries, Transportation, Entertainment"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Budget Amount ($)</label>
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
          <label htmlFor="period">Budget Period</label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            required
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/budgets')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Budget' : 'Create Budget')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;