package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {
    List<UserInterest> findByUser(User user);
    void deleteByUser(User user);
    void deleteByUserAndInterest(User user, String interest);
    boolean existsByUserAndInterest(User user, String interest);
}
