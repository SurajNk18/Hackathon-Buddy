package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {

    List<Hackathon> findByIsActiveTrue();

    List<Hackathon> findByCategoryAndIsActiveTrue(String category);

    @Query("SELECT h FROM Hackathon h WHERE h.isActive = true AND h.startDate >= :today ORDER BY h.startDate ASC")
    List<Hackathon> findUpcomingHackathons(LocalDate today);

    @Query("SELECT h FROM Hackathon h WHERE h.isActive = true ORDER BY h.createdAt DESC")
    List<Hackathon> findRecentHackathons();

    List<Hackathon> findByTitleContainingIgnoreCaseAndIsActiveTrue(String keyword);
}
