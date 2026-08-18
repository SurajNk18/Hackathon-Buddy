package com.hackathonbuddy.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    private Long id;
    private String type;
    private String message;
    private String time; // Human-readable e.g. "2 hours ago"
    private LocalDateTime createdAt;
}
