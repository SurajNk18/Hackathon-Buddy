package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.request.CreateTeamRequest;
import com.hackathonbuddy.dto.response.TeamMemberResponse;
import com.hackathonbuddy.dto.response.TeamResponse;
import com.hackathonbuddy.entity.*;
import com.hackathonbuddy.repository.*;
import com.hackathonbuddy.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;

    @Override
    public TeamResponse getMyTeam(User user) {
        return teamRepository.findFirstTeamForUser(user)
                .map(team -> toResponse(team, user))
                .orElse(null);
    }

    @Override
    public List<TeamResponse> getAllMyTeams(User user) {
        return teamRepository.findTeamsByMember(user)
                .stream()
                .map(team -> toResponse(team, user))
                .collect(Collectors.toList());
    }

    @Override
    public TeamResponse createTeam(CreateTeamRequest request, User user) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .leader(user)
                .skillCoveragePercent(0)
                .build();

        if (request.getHackathonId() != null) {
            hackathonRepository.findById(request.getHackathonId())
                    .ifPresent(team::setHackathon);
        }

        team = teamRepository.save(team);

        // Auto-add leader as first member
        TeamMember leaderMember = TeamMember.builder()
                .team(team)
                .user(user)
                .role("Team Leader")
                .status("ACCEPTED")
                .build();
        teamMemberRepository.save(leaderMember);

        return toResponse(team, user);
    }

    @Override
    public TeamResponse addMember(Long teamId, Long userId, String role, User currentUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User newMember = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!teamMemberRepository.existsByTeamAndUser(team, newMember)) {
            TeamMember member = TeamMember.builder()
                    .team(team)
                    .user(newMember)
                    .role(role != null ? role : "Member")
                    .status("ACCEPTED")
                    .build();
            teamMemberRepository.save(member);
        }

        return toResponse(team, currentUser);
    }

    @Override
    public TeamResponse getSkillGap(Long teamId, User currentUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        // Skill gap analysis will be computed by Python ML service
        // For now return team with computed coverage
        return toResponse(team, currentUser);
    }

    private TeamResponse toResponse(Team team, User currentUser) {
        List<TeamMember> members = teamMemberRepository.findByTeamAndStatus(team, "ACCEPTED");

        List<TeamMemberResponse> memberResponses = members.stream()
                .map(m -> TeamMemberResponse.builder()
                        .id(m.getId())
                        .userId(m.getUser().getId())
                        .name(m.getUser().getFirstName() + " " + m.getUser().getLastName())
                        .email(m.getUser().getEmail())
                        .role(m.getRole())
                        .status(m.getStatus())
                        .isCurrentUser(currentUser != null && m.getUser().getId().equals(currentUser.getId()))
                        .build())
                .collect(Collectors.toList());

        TeamMemberResponse leader = memberResponses.stream()
                .filter(m -> m.getUserId().equals(team.getLeader().getId()))
                .findFirst()
                .orElse(null);

        // Simulated missing skills until ML service integration
        List<String> missingSkills = Arrays.asList("Docker", "AWS", "Kubernetes");

        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .leader(leader)
                .members(memberResponses)
                .skillCoveragePercent(team.getSkillCoveragePercent() != null ? team.getSkillCoveragePercent() : 82)
                .missingSkills(missingSkills)
                .isActive(team.getIsActive())
                .build();
    }
}
