package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.Activity;
import com.hackathonbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserOrderByCreatedAtDesc(User user);
    List<Activity> findTop10ByUserOrderByCreatedAtDesc(User user);
}
