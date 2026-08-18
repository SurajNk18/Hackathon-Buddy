package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.ProjectIdea;
import com.hackathonbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectIdeaRepository extends JpaRepository<ProjectIdea, Long> {
    List<ProjectIdea> findByGeneratedForOrderByGeneratedAtDesc(User user);
    List<ProjectIdea> findTop5ByGeneratedForOrderByGeneratedAtDesc(User user);
    long countByGeneratedFor(User user);
}
