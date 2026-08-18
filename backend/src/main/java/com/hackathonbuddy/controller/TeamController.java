package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.request.CreateTeamRequest;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.TeamResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final UserRepository userRepository;

    private User getUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/my-team")
    public ResponseEntity<ApiResponse<TeamResponse>> getMyTeam(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        TeamResponse team = teamService.getMyTeam(user);
        return ResponseEntity.ok(ApiResponse.<TeamResponse>builder()
                .success(true).message("Team retrieved").data(team).build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getAllMyTeams(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<TeamResponse> teams = teamService.getAllMyTeams(user);
        return ResponseEntity.ok(ApiResponse.<List<TeamResponse>>builder()
                .success(true).message("Teams retrieved").data(teams).build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeamResponse>> createTeam(
            @Valid @RequestBody CreateTeamRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        TeamResponse team = teamService.createTeam(request, user);
        return ResponseEntity.ok(ApiResponse.<TeamResponse>builder()
                .success(true).message("Team created successfully").data(team).build());
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<ApiResponse<TeamResponse>> addMember(
            @PathVariable Long teamId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "Member") String role,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        TeamResponse team = teamService.addMember(teamId, userId, role, user);
        return ResponseEntity.ok(ApiResponse.<TeamResponse>builder()
                .success(true).message("Member added").data(team).build());
    }

    @GetMapping("/{teamId}/skill-gap")
    public ResponseEntity<ApiResponse<TeamResponse>> getSkillGap(
            @PathVariable Long teamId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        TeamResponse team = teamService.getSkillGap(teamId, user);
        return ResponseEntity.ok(ApiResponse.<TeamResponse>builder()
                .success(true).message("Skill gap retrieved").data(team).build());
    }
}
