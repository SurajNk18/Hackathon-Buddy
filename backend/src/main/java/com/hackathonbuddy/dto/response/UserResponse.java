package com.hackathonbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String primaryRole;
    private String location;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String techSkills;
    private String projectDomains;
    private List<String> skills;
    private List<String> domains;
    private Boolean isActive;
    private Boolean isAdmin;
    private Boolean profileComplete;
    private LocalDateTime createdAt;
}
