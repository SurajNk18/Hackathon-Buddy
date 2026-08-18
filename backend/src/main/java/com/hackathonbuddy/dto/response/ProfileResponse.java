package com.hackathonbuddy.dto.response;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private Boolean profileComplete;

    // Preferences
    private String bio;
    private String location;
    private String profilePhotoUrl;
    private String preferredRole;
    private List<String> preferredDomains;

    // Skills
    private List<SkillEntry> skills;

    // Interests
    private List<String> interests;

    // Experience
    private ExperienceEntry experience;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillEntry {
        private Long skillId;
        private String name;
        private String category;
        private Integer proficiencyLevel; // 1=Beginner, 2=Intermediate, 3=Advanced
        private String proficiencyLabel;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExperienceEntry {
        private Integer yearsOfExperience;
        private Integer projectCount;
        private Boolean hasInternship;
        private String certifications;
    }
}
