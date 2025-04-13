// Reports.jsx
import React, { useState, useEffect } from 'react';
import { fetchTransactions } from './Api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('expense-by-category');
  const [timeFrame, setTimeFrame] = useState('month');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6E6E', '#50B432', '#ED561B'];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);

        // Calculate date range based on timeFrame
        const endDate = new Date();
        const startDate = new Date();

        if (timeFrame === 'month') {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (timeFrame === 'quarter') {
          startDate.setMonth(startDate.getMonth() - 3);
        } else if (timeFrame === 'year') {
          startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const filters = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };

        const data = await fetchTransactions(filters);
        setTransactions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load transaction data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [timeFrame]);

  // Prepare data for charts based on report type
  const prepareChartData = () => {
    if (!transactions.length) return [];

    if (reportType === 'expense-by-category') {
      // Group expenses by category
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, transaction) => {
          const { category, amount } = transaction;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {});

      // Convert to array format for charts
      return Object.keys(expensesByCategory).map(category => ({
        name: category,
        value: expensesByCategory[category]
      }));
    }

    else if (reportType === 'income-vs-expense') {
      // Group by month and calculate income vs expense
      const monthlyData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = { name: monthYear, income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          acc[monthYear].income += transaction.amount;
        } else {
          acc[monthYear].expense += transaction.amount;
        }

        return acc;
      }, {});

      // Convert to array and sort by date
      return Object.values(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.name.split('/');
        const [bMonth, bYear] = b.name.split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
    }

    else if (reportType === 'spending-trend') {
      // Create daily spending data
      const dailyExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, transaction) => {
          const date = new Date(transaction.date).toISOString().split('T')[0];

          if (!acc[date]) {
            acc[date] = { date, amount: 0 };
          }

          acc[date].amount += transaction.amount;
          return acc;
        }, {});

      // Convert to array and sort by date
      return Object.values(dailyExpenses).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      );
    }

    return [];
  };

  const renderChart = () => {
    const chartData = prepareChartData();

    if (chartData.length === 0) {
      return <p>No data available for the selected time frame.</p>;
    }

    if (reportType === 'expense-by-category') {
      return (
        <div className="chart-container">
          <h3>Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-summary">
            <h4>Summary</h4>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => {
                  const total = chartData.reduce((sum, i) => sum + i.value, 0);
                  const percentage = ((item.value / total) * 100).toFixed(1);

                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${item.value.toFixed(2)}</td>
                      <td>{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }