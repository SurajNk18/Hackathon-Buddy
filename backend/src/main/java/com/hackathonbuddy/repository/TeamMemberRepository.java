package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.TeamMember;
import com.hackathonbuddy.entity.Team;
import com.hackathonbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeam(Team team);
    List<TeamMember> findByTeamAndStatus(Team team, String status);
    boolean existsByTeamAndUser(Team team, User user);
}
