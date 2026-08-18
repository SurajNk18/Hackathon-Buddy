package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.HackathonResponse;
import com.hackathonbuddy.entity.Hackathon;
import com.hackathonbuddy.entity.Registration;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.HackathonRepository;
import com.hackathonbuddy.repository.RegistrationRepository;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.ActivityService;
import com.hackathonbuddy.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationRepository registrationRepository;
    private final HackathonRepository hackathonRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    private User getUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HackathonResponse>>> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<HackathonResponse> registrations = registrationRepository.findByUser(user)
                .stream()
                .map(r -> HackathonResponse.builder()
                        .id(r.getHackathon().getId())
                        .title(r.getHackathon().getTitle())
                        .category(r.getHackathon().getCategory())
                        .prizePool(r.getHackathon().getPrizePool())
                        .isRegistered(true)
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<HackathonResponse>>builder()
                .success(true).message("Registrations retrieved").data(registrations).build());
    }

    @PostMapping("/{hackathonId}")
    public ResponseEntity<ApiResponse<String>> register(
            @PathVariable Long hackathonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));

        if (registrationRepository.existsByUserAndHackathon(user, hackathon)) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .success(false).message("Already registered for this hackathon").build());
        }

        Registration registration = Registration.builder()
                .user(user).hackathon(hackathon).status("REGISTERED").build();
        registrationRepository.save(registration);

        // Log activity and create notification
        activityService.logActivity(user, "REGISTRATION",
                "You registered for " + hackathon.getTitle(),
                hackathonId.toString(), "HACKATHON");
        notificationService.createNotification(user,
                "Registration Confirmed",
                "You've successfully registered for " + hackathon.getTitle(),
                "SUCCESS");

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true).message("Successfully registered").data("REGISTERED").build());
    }

    @DeleteMapping("/{hackathonId}")
    public ResponseEntity<ApiResponse<String>> withdraw(
            @PathVariable Long hackathonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
        registrationRepository.findByUserAndHackathon(user, hackathon)
                .ifPresent(r -> {
                    r.setStatus("WITHDRAWN");
                    registrationRepository.save(r);
                });
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true).message("Registration withdrawn").build());
    }
}
