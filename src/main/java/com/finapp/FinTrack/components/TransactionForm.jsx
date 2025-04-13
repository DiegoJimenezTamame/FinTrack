import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, TextField, FormControl, InputLabel, MenuItem,
  Select, Typography, FormHelperText, Grid
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthContext } from '../contexts/AuthContext';
import { CategoryService, AccountService, TransactionService } from '../api/api';

function TransactionForm({ onSuccess, transaction = null, onCancel }) {
  const { currentUser } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date(),
    description: '',
    type: 'EXPENSE',
    categoryId: '',
    accountId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, accountsRes] = await Promise.all([
          CategoryService.getCategories(currentUser.id),
          AccountService.getAccounts(currentUser.id),
        ]);
        setCategories(categoriesRes.data);
        setAccounts(accountsRes.data);

        // If editing, populate the form with transaction data
        if (transaction) {
          setFormData({
            amount: transaction.amount.toString(),
            date: new Date(transaction.date),
            description: transaction.description || '',
            type: transaction.type,
            categoryId: transaction.categoryId || '',
            accountId: transaction.accountId,
          });
        } else if (accountsRes.data.length > 0) {
          // Set default account if available
          setFormData(prev => ({
            ...prev,
            accountId: accountsRes.data[0].id
          }));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser, transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
    }

    if (formData.type === 'EXPENSE' && !formData.categoryId) {
      newErrors.categoryId = 'Category is required for expenses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const transactionData = {
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().split('T')[0],
        description: formData.description,
        type: formData.type,
        categoryId: formData.categoryId || null,
        accountId: formData.accountId,
      };

      if (transaction) {
        // Update existing transaction
        await TransactionService.updateTransaction(transaction.id, transactionData);
      } else {
        // Create new transaction
        await TransactionService.createTransaction(currentUser.id, transactionData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            error={!!errors.amount}
            helperText={errors.amount}
            inputProps={{ step: "0.01" }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" error={!!errors.accountId}>
            <InputLabel>Account</InputLabel>
            <Select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              label="Account"
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} ({account.balance} {account.currency})
                </MenuItem>
              ))}
            </Select>
            {errors.accountId && <FormHelperText>{errors.accountId}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="INCOME">Income</MenuItem>
              <MenuItem value="EXPENSE">Expense</MenuItem>
              <MenuItem value="TRANSFER">Transfer</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              label="Category"
              disabled={formData.type === 'TRANSFER'}
            >
              {categories
                .filter(category =>
                  formData.type === 'INCOME' ?
                    category.type === 'INCOME' :
                    category.type === 'EXPENSE'
                )
                .map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              }
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {onCancel && (
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" color="primary">
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
      </Box>
    </Box>
  );
}

export default TransactionForm;