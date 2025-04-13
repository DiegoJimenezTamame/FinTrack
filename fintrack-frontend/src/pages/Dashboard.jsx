            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" align="center">Total Balance</Typography>
                <Typography variant="h5" align="center">
                  {formatCurrency(totalBalance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Transactions
                </Typography>
                <List>
                  {recentTransactions.map((transaction) => (
                    <ListItem key={transaction.id} divider>
                      <ListItemText
                        primary={`${transaction.type === 'INCOME' ? 'Income' : 'Expense'}: ${formatCurrency(transaction.amount)}`}
                        secondary={format(new Date(transaction.date), 'MMM dd, yyyy')}
                      />
                      <IconButton onClick={() => handleEditTransaction(transaction)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDeleteTransaction(transaction.id)}><Delete /></IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Spending by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Monthly Income & Expense
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#0088FE" />
                  <Bar dataKey="expense" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Form Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <DialogContent>
          <TransactionForm
            transaction={selectedTransaction}
            onSuccess={handleTransactionSuccess}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
