package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.request.CreateTeamRequest;
import com.hackathonbuddy.dto.response.TeamResponse;
import com.hackathonbuddy.entity.User;
import java.util.List;

public interface TeamService {
    TeamResponse getMyTeam(User user);
    List<TeamResponse> getAllMyTeams(User user);
    TeamResponse createTeam(CreateTeamRequest request, User user);
    TeamResponse addMember(Long teamId, Long userId, String role, User currentUser);
    TeamResponse getSkillGap(Long teamId, User currentUser);
}
