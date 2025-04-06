package com.finapp.FinTrack.repository;

import com.finapp.FinTrack.model.RecurringTransaction;
import com.finapp.FinTrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {
    List<RecurringTransaction> findByUser(User user);
    List<RecurringTransaction> findByUserAndNextDateLessThanEqual(User user, LocalDate date);
}