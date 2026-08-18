package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.Registration;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.entity.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUser(User user);
    List<Registration> findByUserAndStatus(User user, String status);
    Optional<Registration> findByUserAndHackathon(User user, Hackathon hackathon);
    boolean existsByUserAndHackathon(User user, Hackathon hackathon);
    long countByUser(User user);
}
