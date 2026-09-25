package com.hackathonbuddy.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private Boolean unread;
    private String icon;
    private String action;
    private String route;
    private String actionUrl;
    private String time;
    private String date;
    private LocalDateTime createdAt;
}
