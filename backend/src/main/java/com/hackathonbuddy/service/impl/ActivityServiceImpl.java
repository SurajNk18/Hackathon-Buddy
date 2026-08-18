package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.response.ActivityResponse;
import com.hackathonbuddy.entity.Activity;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.ActivityRepository;
import com.hackathonbuddy.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;

    @Override
    public List<ActivityResponse> getRecentActivity(User user) {
        return activityRepository.findTop10ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void logActivity(User user, String type, String message) {
        logActivity(user, type, message, null, null);
    }

    @Override
    public void logActivity(User user, String type, String message, String referenceId, String referenceType) {
        Activity activity = Activity.builder()
                .user(user)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();
        activityRepository.save(activity);
    }

    private ActivityResponse toResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType().toLowerCase())
                .message(activity.getMessage())
                .time(getRelativeTime(activity.getCreatedAt()))
                .createdAt(activity.getCreatedAt())
                .build();
    }

    private String getRelativeTime(LocalDateTime createdAt) {
        if (createdAt == null) return "just now";
        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) return "just now";
        if (minutes < 60) return minutes + " minute" + (minutes == 1 ? "" : "s") + " ago";
        if (hours < 24) return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        if (days < 7) return days + " day" + (days == 1 ? "" : "s") + " ago";
        return createdAt.toLocalDate().toString();
    }
}
