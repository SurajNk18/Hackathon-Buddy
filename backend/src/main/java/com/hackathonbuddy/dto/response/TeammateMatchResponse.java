package com.hackathonbuddy.dto.response;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeammateMatchResponse {
    private Long userId;
    private String name;
    private String profilePhotoUrl;
    private String preferredRole;
    private String bio;
    private Integer yearsOfExperience;
    private Integer projectCount;
    private List<String> skills;
    private List<String> interests;
    private Double compatibilityScore; // 0-100
    private List<String> commonSkills;
    private List<String> complementarySkills;
    private String matchReason;
}
