package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ActivityResponse;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityResponse>>> getActivity(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<ActivityResponse> activities = activityService.getRecentActivity(user);
        return ResponseEntity.ok(ApiResponse.<List<ActivityResponse>>builder()
                .success(true).message("Activity retrieved").data(activities).build());
    }
}
