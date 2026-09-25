package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.response.NotificationResponse;
import com.hackathonbuddy.entity.User;
import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getNotifications(User user);
    long getUnreadCount(User user);
    void markAllAsRead(User user);
    void markAsRead(Long notificationId);
    void deleteNotification(Long notificationId);
    void clearAllNotifications(User user);
    void createNotification(User user, String title, String message, String type);
    void createNotification(User user, String title, String message, String type, String icon, String action, String route);
}
