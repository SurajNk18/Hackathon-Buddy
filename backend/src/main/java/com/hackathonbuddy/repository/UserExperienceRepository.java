package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.entity.UserExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserExperienceRepository extends JpaRepository<UserExperience, Long> {
    Optional<UserExperience> findByUser(User user);
}
