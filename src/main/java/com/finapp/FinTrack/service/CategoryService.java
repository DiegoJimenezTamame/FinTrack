package com.finapp.FinTrack.service;

import com.finapp.FinTrack.dto.CategoryDTO;
import com.finapp.FinTrack.model.Category;
import com.finapp.FinTrack.model.User;
import com.finapp.FinTrack.repository.CategoryRepository;
import com.finapp.FinTrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryDTO> getCategoriesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return categoryRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getCategoriesByUserAndType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return categoryRepository.findByUserAndType(user, type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(Long userId, CategoryDTO categoryDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = new Category();
        category.setUser(user);
        category.setName(categoryDTO.getName());
        category.setType(categoryDTO.getType());
        category.setIcon(categoryDTO.getIcon());
        category.setColor(categoryDTO.getColor());

        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public Optional<CategoryDTO> updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    category.setName(categoryDTO.getName());
                    category.setIcon(categoryDTO.getIcon());
                    category.setColor(categoryDTO.getColor());
                    return convertToDTO(categoryRepository.save(category));
                });
    }

    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setType(category.getType());
        dto.setIcon(category.getIcon());
        dto.setColor(category.getColor());
        return dto;
    }
}