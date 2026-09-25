package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.request.CreateHackathonRequest;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.HackathonResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.HackathonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@RequiredArgsConstructor
public class HackathonController {

    private final HackathonService hackathonService;
    private final UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HackathonResponse>>> getAllHackathons(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        List<HackathonResponse> hackathons = hackathonService.getAllHackathons(user);
        return ResponseEntity.ok(ApiResponse.<List<HackathonResponse>>builder()
                .success(true).message("Hackathons retrieved").data(hackathons).build());
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<HackathonResponse>>> getRecommended(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        List<HackathonResponse> hackathons = hackathonService.getRecommendedHackathons(user);
        return ResponseEntity.ok(ApiResponse.<List<HackathonResponse>>builder()
                .success(true).message("Recommended hackathons retrieved").data(hackathons).build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<HackathonResponse>>> getUpcoming(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        List<HackathonResponse> hackathons = hackathonService.getUpcomingHackathons(user);
        return ResponseEntity.ok(ApiResponse.<List<HackathonResponse>>builder()
                .success(true).message("Upcoming hackathons retrieved").data(hackathons).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HackathonResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        HackathonResponse hackathon = hackathonService.getHackathonById(id, user);
        return ResponseEntity.ok(ApiResponse.<HackathonResponse>builder()
                .success(true).message("Hackathon retrieved").data(hackathon).build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HackathonResponse>> createHackathon(
            @RequestBody CreateHackathonRequest request) {
        HackathonResponse hackathon = hackathonService.createHackathon(request);
        return ResponseEntity.ok(ApiResponse.<HackathonResponse>builder()
                .success(true).message("Hackathon created").data(hackathon).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHackathon(@PathVariable Long id) {
        hackathonService.deleteHackathon(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("Hackathon deleted").build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<HackathonResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        HackathonResponse hackathon = hackathonService.updateHackathonStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<HackathonResponse>builder()
                .success(true).message("Hackathon status updated").data(hackathon).build());
    }
}
