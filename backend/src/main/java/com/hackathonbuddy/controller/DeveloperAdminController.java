package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.UserResponse;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for Developer Admin — manages developer profiles,
 * developer activity, and technical resources.
 *
 * Accessible by ROLE_DEVELOPER_ADMIN and ROLE_SUPER_ADMIN.
 */
@RestController
@RequestMapping("/api/developer-admin")
@RequiredArgsConstructor
public class DeveloperAdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    /**
     * Get dashboard stats for Developer Admin
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        List<User> allUsers = userRepository.findAll();

        long totalDevelopers = allUsers.stream()
                .filter(u -> u.getRole() != null &&
                        ("DEVELOPER".equalsIgnoreCase(u.getRole().getName()) ||
                         "STUDENT".equalsIgnoreCase(u.getRole().getName())))
                .count();

        long activeDevelopers = allUsers.stream()
                .filter(u -> u.getIsActive() && u.getRole() != null &&
                        ("DEVELOPER".equalsIgnoreCase(u.getRole().getName()) ||
                         "STUDENT".equalsIgnoreCase(u.getRole().getName())))
                .count();

        long profilesComplete = allUsers.stream()
                .filter(u -> u.getProfileComplete() != null && u.getProfileComplete())
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDevelopers", totalDevelopers);
        stats.put("activeDevelopers", activeDevelopers);
        stats.put("profilesComplete", profilesComplete);
        stats.put("totalUsers", allUsers.size());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true).message("Developer admin stats").data(stats).build());
    }

    /**
     * Get all developer/student profiles
     */
    @GetMapping("/developers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getDevelopers() {
        List<UserResponse> developers = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null &&
                        ("DEVELOPER".equalsIgnoreCase(u.getRole().getName()) ||
                         "STUDENT".equalsIgnoreCase(u.getRole().getName())))
                .map(this::toUserResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .success(true).message("Developers retrieved").data(developers).build());
    }

    /**
     * Get all users for developer management
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .success(true).message("All users retrieved").data(users).build());
    }

    /**
     * Toggle developer active status
     */
    @PutMapping("/developers/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleDeveloperStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(!user.getIsActive());
        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true).message("Developer status toggled").data(toUserResponse(user)).build());
    }

    /**
     * Get developer activity summary
     */
    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDeveloperActivity() {
        List<User> allUsers = userRepository.findAll();

        // Group by primary role
        Map<String, Long> roleDistribution = allUsers.stream()
                .filter(u -> u.getPrimaryRole() != null)
                .collect(Collectors.groupingBy(User::getPrimaryRole, Collectors.counting()));

        // Group by location
        Map<String, Long> locationDistribution = allUsers.stream()
                .filter(u -> u.getLocation() != null && !u.getLocation().isEmpty())
                .collect(Collectors.groupingBy(User::getLocation, Collectors.counting()));

        Map<String, Object> activity = new HashMap<>();
        activity.put("roleDistribution", roleDistribution);
        activity.put("locationDistribution", locationDistribution);
        activity.put("totalProfiles", allUsers.size());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true).message("Activity data retrieved").data(activity).build());
    }

    private UserResponse toUserResponse(User user) {
        String roleName = user.getRole() != null ? user.getRole().getName() : "STUDENT";
        boolean isAdmin = "ADMIN".equalsIgnoreCase(roleName) ||
                           "HACKATHON_ADMIN".equalsIgnoreCase(roleName) ||
                           "DEVELOPER_ADMIN".equalsIgnoreCase(roleName) ||
                           "SUPER_ADMIN".equalsIgnoreCase(roleName);
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(roleName)
                .primaryRole(user.getPrimaryRole())
                .location(user.getLocation())
                .bio(user.getBio())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .isActive(user.getIsActive())
                .isAdmin(isAdmin)
                .profileComplete(user.getProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
