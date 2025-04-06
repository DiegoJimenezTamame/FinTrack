package com.finapp.FinTrack.controller;

import com.finapp.FinTrack.dto.CategoryDTO;
import com.finapp.FinTrack.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000") // For React frontend
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(categoryService.getCategoriesByUserId(userId));
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByUserAndType(
            @PathVariable Long userId, @PathVariable String type) {
        return ResponseEntity.ok(categoryService.getCategoriesByUserAndType(userId, type));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<CategoryDTO> createCategory(
            @PathVariable Long userId, @RequestBody CategoryDTO categoryDTO) {
        return ResponseEntity.ok(categoryService.createCategory(userId, categoryDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        return categoryService.updateCategory(id, categoryDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}