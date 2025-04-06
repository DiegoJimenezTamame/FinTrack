package com.finapp.FinTrack.repository;

import com.finapp.FinTrack.model.Account;
import com.finapp.FinTrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
}