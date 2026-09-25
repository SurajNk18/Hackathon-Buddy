package com.hackathonbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HackathonResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String organizer;
    private String startDate;
    private String endDate;
    private String registrationDeadline;
    private String prizePool;
    private String location;
    private String mode;
    private Integer maxTeamSize;
    private Integer minTeamSize;
    private String imageUrl;
    private String websiteUrl;
    private Boolean isActive;
    private Integer matchScore;
    private Boolean isRegistered;

    // New fields for frontend compatibility
    private String date;
    private String deadline;
    private String prize;
    private Integer participants;
    private String duration;
    private Integer match;
    private String status;
    private String level;
    private String color;
    private String icon;
    private String type;
}
