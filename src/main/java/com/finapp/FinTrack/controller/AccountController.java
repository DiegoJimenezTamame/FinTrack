package com.finapp.FinTrack.controller;

import com.finapp.FinTrack.dto.AccountDTO;
import com.finapp.FinTrack.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000") // For React frontend
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountDTO>> getAccountsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(accountService.getAccountsByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AccountDTO> createAccount(
            @PathVariable Long userId, @RequestBody AccountDTO accountDTO) {
        return ResponseEntity.ok(accountService.createAccount(userId, accountDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(
            @PathVariable Long id, @RequestBody AccountDTO accountDTO) {
        return accountService.updateAccount(id, accountDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok().build();
    }
}