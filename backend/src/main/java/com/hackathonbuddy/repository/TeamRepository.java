package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.Team;
import com.hackathonbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByLeader(User leader);

    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.user = :user AND m.status = 'ACCEPTED' AND t.isActive = true")
    List<Team> findTeamsByMember(User user);

    @Query("SELECT t FROM Team t WHERE t.leader = :user OR EXISTS (SELECT m FROM TeamMember m WHERE m.team = t AND m.user = :user AND m.status = 'ACCEPTED')")
    Optional<Team> findFirstTeamForUser(User user);
}
