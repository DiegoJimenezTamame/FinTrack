package com.finapp.FinTrack.repository;

import com.finapp.FinTrack.model.Account;
import com.finapp.FinTrack.model.Category;
import com.finapp.FinTrack.model.Transaction;
import com.finapp.FinTrack.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndType(User user, String type);
    List<Transaction> findByUserAndAccount(User user, Account account);
    List<Transaction> findByUserAndCategory(User user, Category category);
    List<Transaction> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}