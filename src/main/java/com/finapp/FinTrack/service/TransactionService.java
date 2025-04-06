package com.finapp.FinTrack.service;

import com.finapp.FinTrack.dto.TransactionDTO;
import com.finapp.FinTrack.model.Account;
import com.finapp.FinTrack.model.Category;
import com.finapp.FinTrack.model.Transaction;
import com.finapp.FinTrack.model.User;
import com.finapp.FinTrack.repository.AccountRepository;
import com.finapp.FinTrack.repository.CategoryRepository;
import com.finapp.FinTrack.repository.TransactionRepository;
import com.finapp.FinTrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TransactionDTO> getTransactionsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByUserAndType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUserAndType(user, type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByUserAndDateRange(Long userId, LocalDate start, LocalDate end) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUserAndDateBetween(user, start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionDTO createTransaction(Long userId, TransactionDTO transactionDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(transactionDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Ensure the account belongs to the user
        if (!account.getUser().getId().equals(userId)) {
            throw new RuntimeException("Account does not belong to this user");
        }

        Category category = null;
        if (transactionDTO.getCategoryId() != null) {
            category = categoryRepository.findById(transactionDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            // Ensure the category belongs to the user
            if (!category.getUser().getId().equals(userId)) {
                throw new RuntimeException("Category does not belong to this user");
            }
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());
        transaction.setType(transactionDTO.getType());

        // Update account balance
        updateAccountBalance(account, transaction);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    @Transactional
    public Optional<TransactionDTO> updateTransaction(Long transactionId, TransactionDTO transactionDTO) {
        return transactionRepository.findById(transactionId)
                .map(transaction -> {
                    // Get the old amount and type for balance adjustment
                    BigDecimal oldAmount = transaction.getAmount();
                    String oldType = transaction.getType();
                    Account account = transaction.getAccount();

                    // Revert the old transaction's effect on the balance
                    if (oldType.equals("INCOME")) {
                        account.setBalance(account.getBalance().subtract(oldAmount));
                    } else if (oldType.equals("EXPENSE")) {
                        account.setBalance(account.getBalance().add(oldAmount));
                    }

                    // Update account if it's changed
                    if (!transaction.getAccount().getId().equals(transactionDTO.getAccountId())) {
                        account = accountRepository.findById(transactionDTO.getAccountId())
                                .orElseThrow(() -> new RuntimeException("Account not found"));
                        transaction.setAccount(account);
                    }

                    // Update category if provided
                    if (transactionDTO.getCategoryId() != null) {
                        Category category = categoryRepository.findById(transactionDTO.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));
                        transaction.setCategory(category);
                    }

                    transaction.setAmount(transactionDTO.getAmount());
                    transaction.setDate(transactionDTO.getDate());
                    transaction.setDescription(transactionDTO.getDescription());
                    transaction.setType(transactionDTO.getType());

                    // Apply the new transaction's effect on the balance
                    updateAccountBalance(account, transaction);

                    return convertToDTO(transactionRepository.save(transaction));
                });
    }

    @Transactional
    public void deleteTransaction(Long transactionId) {
        transactionRepository.findById(transactionId).ifPresent(transaction -> {
            // Revert the transaction's effect on the account balance
            Account account = transaction.getAccount();
            if (transaction.getType().equals("INCOME")) {
                account.setBalance(account.getBalance().subtract(transaction.getAmount()));
            } else if (transaction.getType().equals("EXPENSE")) {
                account.setBalance(account.getBalance().add(transaction.getAmount()));
            }

            accountRepository.save(account);
            transactionRepository.deleteById(transactionId);
        });
    }

    private void updateAccountBalance(Account account, Transaction transaction) {
        if (transaction.getType().equals("INCOME")) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        } else if (transaction.getType().equals("EXPENSE")) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        }
        accountRepository.save(account);
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setAccountId(transaction.getAccount().getId());
        if (transaction.getCategory() != null) {
            dto.setCategoryId(transaction.getCategory().getId());
        }
        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());
        dto.setDescription(transaction.getDescription());
        dto.setType(transaction.getType());
        return dto;
    }
}