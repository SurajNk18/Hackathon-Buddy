package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.HackathonResponse;
import com.hackathonbuddy.entity.Hackathon;
import com.hackathonbuddy.entity.Notification;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.HackathonRepository;
import com.hackathonbuddy.repository.NotificationRepository;
import com.hackathonbuddy.repository.RegistrationRepository;
import com.hackathonbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for Hackathon Admins (organizers) to manage their hackathons,
 * send announcements, and view registration stats.
 */
@RestController
@RequestMapping("/api/hackathon-admin")
@RequiredArgsConstructor
public class HackathonAdminController {

    private final HackathonRepository hackathonRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Get stats for the hackathon admin dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        long totalHackathons = hackathonRepository.count();
        long totalRegistrations = registrationRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHackathons", totalHackathons);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("openHackathons", hackathonRepository.findByIsActiveTrue().stream()
                .filter(h -> "Open".equalsIgnoreCase(h.getStatus())).count());
        stats.put("closedHackathons", hackathonRepository.findByIsActiveTrue().stream()
                .filter(h -> "Closed".equalsIgnoreCase(h.getStatus())).count());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true).message("Hackathon admin stats").data(stats).build());
    }

    /**
     * Get hackathons managed by this admin
     */
    @GetMapping("/my-hackathons")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyHackathons(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Hackathon> hackathons = hackathonRepository.findByIsActiveTrue();
        List<Map<String, Object>> result = hackathons.stream().map(h -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", h.getId());
            map.put("title", h.getTitle());
            map.put("category", h.getCategory());
            map.put("description", h.getDescription());
            map.put("status", h.getStatus());
            map.put("location", h.getLocation());
            map.put("duration", h.getDuration());
            map.put("participantCount", h.getParticipantCount());
            map.put("icon", h.getIcon());
            map.put("prizePool", h.getPrizePool());
            map.put("startDate", h.getStartDate());
            map.put("registrationDeadline", h.getRegistrationDeadline());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true).message("Hackathons retrieved").data(result).build());
    }

    /**
     * Get registration count for a specific hackathon
     */
    @GetMapping("/hackathons/{hackathonId}/registrations")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRegistrations(
            @PathVariable Long hackathonId) {
        long count = registrationRepository.countByHackathonId(hackathonId);
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));

        Map<String, Object> data = new HashMap<>();
        data.put("hackathonId", hackathonId);
        data.put("hackathonTitle", hackathon.getTitle());
        data.put("registrationCount", count);
        data.put("status", hackathon.getStatus());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true).message("Registration data retrieved").data(data).build());
    }

    /**
     * Send an announcement to hackathon participants.
     * Creates a notification for all users (or users registered for a specific hackathon).
     */
    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendAnnouncement(
            @RequestBody Map<String, String> announcementData,
            @AuthenticationPrincipal UserDetails userDetails) {

        String title = announcementData.getOrDefault("title", "Hackathon Announcement");
        String message = announcementData.getOrDefault("message", "");
        String type = announcementData.getOrDefault("type", "info");
        String hackathonId = announcementData.get("hackathonId");

        // Create notification for all users
        List<User> users = userRepository.findAll();
        int recipientCount = 0;

        for (User user : users) {
            Notification notif = Notification.builder()
                    .user(user)
                    .type("hackathon_announcement")
                    .title(title)
                    .message(message)
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            recipientCount++;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("title", title);
        response.put("message", message);
        response.put("type", type);
        response.put("recipients", recipientCount);
        response.put("sentAt", LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Announcement sent to " + recipientCount + " users")
                .data(response)
                .build());
    }

    /**
     * Get announcement history
     */
    @GetMapping("/announcements")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAnnouncements() {
        // Return recent notifications of type hackathon_announcement
        List<Notification> announcements = notificationRepository.findAll().stream()
                .filter(n -> "hackathon_announcement".equals(n.getType()))
                .limit(50)
                .collect(Collectors.toList());

        List<Map<String, Object>> result = announcements.stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("title", n.getTitle());
            map.put("message", n.getMessage());
            map.put("type", n.getType());
            map.put("createdAt", n.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true).message("Announcements retrieved").data(result).build());
    }
}
