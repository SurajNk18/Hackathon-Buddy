package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.response.DashboardStatsResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.ProjectIdeaRepository;
import com.hackathonbuddy.repository.RegistrationRepository;
import com.hackathonbuddy.repository.TeamRepository;
import com.hackathonbuddy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final RegistrationRepository registrationRepository;
    private final TeamRepository teamRepository;
    private final ProjectIdeaRepository projectIdeaRepository;

    @Override
    public DashboardStatsResponse getDashboardStats(User user) {
        long totalRegistrations = registrationRepository.countByUser(user);
        long activeRegistrations = registrationRepository.findByUserAndStatus(user, "REGISTERED").size();
        long totalTeams = teamRepository.findTeamsByMember(user).size();
        long totalIdeas = projectIdeaRepository.countByGeneratedFor(user);

        return DashboardStatsResponse.builder()
                .hackathons(DashboardStatsResponse.HackathonStats.builder()
                        .value((int) totalRegistrations)
                        .registered((int) activeRegistrations)
                        .build())
                .teams(DashboardStatsResponse.TeamStats.builder()
                        .value((int) totalTeams)
                        .active((int) totalTeams)
                        .build())
                .projectIdeas(DashboardStatsResponse.ProjectIdeaStats.builder()
                        .value((int) totalIdeas)
                        .generated((int) totalIdeas)
                        .build())
                .skillMatch(DashboardStatsResponse.SkillMatchStats.builder()
                        .value(87) // Will be computed by AI service in future
                        .label("Average Score")
                        .build())
                .build();
    }
}
