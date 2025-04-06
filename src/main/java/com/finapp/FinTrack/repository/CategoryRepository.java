package com.finapp.FinTrack.repository;



import com.finapp.FinTrack.model.Category;
import com.finapp.FinTrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);
    List<Category> findByUserAndType(User user, String type);
}