package com.finapp.FinTrack.service;

import com.finapp.FinTrack.dto.AccountDTO;
import com.finapp.FinTrack.model.Account;
import com.finapp.FinTrack.model.User;
import com.finapp.FinTrack.repository.AccountRepository;
import com.finapp.FinTrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public List<AccountDTO> getAccountsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AccountDTO createAccount(Long userId, AccountDTO accountDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setName(accountDTO.getName());
        account.setType(accountDTO.getType());
        account.setBalance(accountDTO.getBalance());
        account.setCurrency(accountDTO.getCurrency());

        Account savedAccount = accountRepository.save(account);
        return convertToDTO(savedAccount);
    }

    public Optional<AccountDTO> updateAccount(Long accountId, AccountDTO accountDTO) {
        return accountRepository.findById(accountId)
                .map(account -> {
                    account.setName(accountDTO.getName());
                    account.setType(accountDTO.getType());
                    account.setBalance(accountDTO.getBalance());
                    account.setCurrency(accountDTO.getCurrency());
                    return convertToDTO(accountRepository.save(account));
                });
    }

    public void deleteAccount(Long accountId) {
        accountRepository.deleteById(accountId);
    }

    private AccountDTO convertToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setName(account.getName());
        dto.setType(account.getType());
        dto.setBalance(account.getBalance());
        dto.setCurrency(account.getCurrency());
        return dto;
    }
}