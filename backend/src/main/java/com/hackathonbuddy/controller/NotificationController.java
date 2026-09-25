package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.NotificationResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<NotificationResponse> notifications = notificationService.getNotifications(user);
        return ResponseEntity.ok(ApiResponse.<List<NotificationResponse>>builder()
                .success(true).message("Notifications retrieved").data(notifications).build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .success(true).message("Unread count").data(count).build());
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("All notifications marked as read").build());
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("Notification marked as read").build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("Notification deleted").build());
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        notificationService.clearAllNotifications(user);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("All notifications cleared").build());
    }
}
