package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.DashboardStatsResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.hackathonbuddy.repository.UserRepository;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        DashboardStatsResponse stats = dashboardService.getDashboardStats(user);
        return ResponseEntity.ok(ApiResponse.<DashboardStatsResponse>builder()
                .success(true)
                .message("Dashboard stats retrieved")
                .data(stats)
                .build());
    }
}
