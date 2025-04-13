// BudgetList.jsx
import React, { useState, useEffect } from 'react';
import { fetchBudgets, deleteBudget } from './Api';
import { Link } from 'react-router-dom';

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBudgets();
        setBudgets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load budgets');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        setBudgets(budgets.filter(b => b._id !== id));
      } catch (err) {
        setError('Failed to delete budget');
        console.error(err);
      }
    }
  };

  if (isLoading) return <div className="loading">Loading budgets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="budget-list">
      <h1>Budgets</h1>

      <Link to="/budgets/add" className="btn btn-primary">
        Create New Budget
      </Link>

      {budgets.length === 0 ? (
        <p>No budgets found. Create your first budget to start tracking your spending.</p>
      ) : (
        <div className="budget-grid">
          {budgets.map(budget => {
            const percentUsed = (budget.spent / budget.amount) * 100;
            const isOverBudget = percentUsed > 100;

            return (
              <div key={budget._id} className="budget-card">
                <h3>{budget.category}</h3>
                <div className="budget-details">
                  <p>Budget: ${budget.amount.toFixed(2)}</p>
                  <p>Spent: ${budget.spent.toFixed(2)}</p>
                  <p className={isOverBudget ? 'over-budget' : ''}>
                    Remaining: ${(budget.amount - budget.spent).toFixed(2)}
                  </p>
                </div>

                <div className="budget-progress">
                  <div
                    className={`progress-bar ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  ></div>
                </div>

                <div className="budget-actions">
                  <Link to={`/budgets/edit/${budget._id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetList;