package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.response.NotificationResponse;
import com.hackathonbuddy.entity.Notification;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.NotificationRepository;
import com.hackathonbuddy.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Override
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Override
    @Transactional
    public void clearAllNotifications(User user) {
        notificationRepository.deleteByUser(user);
    }

    @Override
    public void createNotification(User user, String title, String message, String type) {
        createNotification(user, title, message, type, null, null, null);
    }

    @Override
    public void createNotification(User user, String title, String message, String type,
                                    String icon, String action, String route) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .icon(icon)
                .action(action)
                .route(route)
                .build();
        notificationRepository.save(notification);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .unread(!Boolean.TRUE.equals(n.getIsRead()))
                .icon(n.getIcon())
                .action(n.getAction())
                .route(n.getRoute())
                .actionUrl(n.getActionUrl())
                .time(formatRelativeTime(n.getCreatedAt()))
                .date(n.getCreatedAt() != null && n.getCreatedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate()) ? "Today" : "Earlier")
                .createdAt(n.getCreatedAt())
                .build();
    }

    private String formatRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) return "Just now";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minutes ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        long days = duration.toDays();
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }
}
