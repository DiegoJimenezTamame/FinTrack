package com.finapp.FinTrack.controller;

import com.finapp.FinTrack.dto.TransactionDTO;
import com.finapp.FinTrack.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000") // For React frontend
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserId(userId));
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUserAndType(
            @PathVariable Long userId, @PathVariable String type) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserAndType(userId, type));
    }

    @GetMapping("/user/{userId}/daterange")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(
                transactionService.getTransactionsByUserAndDateRange(userId, startDate, endDate));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<TransactionDTO> createTransaction(
            @PathVariable Long userId, @RequestBody TransactionDTO transactionDTO) {
        return ResponseEntity.ok(transactionService.createTransaction(userId, transactionDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable Long id, @RequestBody TransactionDTO transactionDTO) {
        return transactionService.updateTransaction(id, transactionDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }
}