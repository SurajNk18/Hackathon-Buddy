package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.UserResponse;
import com.hackathonbuddy.entity.Role;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.RoleRepository;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.repository.HackathonRepository;
import com.hackathonbuddy.repository.RegistrationRepository;
import com.hackathonbuddy.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HackathonRepository hackathonRepository;
    private final RegistrationRepository registrationRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get full system statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalHackathons = hackathonRepository.count();
        long totalRegistrations = registrationRepository.count();
        long totalTeams = teamRepository.count();
        long hackathonAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null &&
                        ("HACKATHON_ADMIN".equalsIgnoreCase(u.getRole().getName()) ||
                         "ADMIN".equalsIgnoreCase(u.getRole().getName())))
                .count();
        long superAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(u.getRole().getName()))
                .count();

        Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers,
                "totalHackathons", totalHackathons,
                "totalRegistrations", totalRegistrations,
                "totalTeams", totalTeams,
                "hackathonAdmins", hackathonAdmins,
                "superAdmins", superAdmins
        );

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true).message("System stats retrieved").data(stats).build());
    }

    /**
     * Get all users with their roles
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
     * Assign a role to a user (SUPER_ADMIN privilege)
     */
    @PutMapping("/users/{userId}/assign-role")
    public ResponseEntity<ApiResponse<UserResponse>> assignRole(
            @PathVariable Long userId,
            @RequestParam String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.setRole(role);
        user = userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Role '" + roleName + "' assigned to " + user.getFirstName())
                .data(toUserResponse(user))
                .build());
    }

    /**
     * Toggle user active/suspended status
     */
    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(!user.getIsActive());
        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true).message("User status toggled").data(toUserResponse(user)).build());
    }

    /**
     * Delete a user (SUPER_ADMIN privilege)
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("User deleted").build());
    }

    /**
     * Get all available roles
     */
    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<String>>> getAllRoles() {
        List<String> roles = roleRepository.findAll().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<String>>builder()
                .success(true).message("Roles retrieved").data(roles).build());
    }

    /**
     * Reset a user's password (SUPER_ADMIN privilege)
     */
    @PutMapping("/users/{userId}/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @PathVariable Long userId,
            @RequestParam String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true).message("Password reset for " + user.getEmail()).data("OK").build());
    }

    /**
     * Create a new admin account (SUPER_ADMIN privilege)
     */
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<UserResponse>> createAdmin(@RequestBody java.util.Map<String, String> request) {
        String email = request.getOrDefault("email", "").toLowerCase().trim();
        String firstName = request.getOrDefault("firstName", "Admin");
        String lastName = request.getOrDefault("lastName", "User");
        String password = request.getOrDefault("password", "admin123");
        String roleName = request.getOrDefault("roleName", "HACKATHON_ADMIN").toUpperCase();
        String primaryRole = request.getOrDefault("primaryRole", "Hackathon Organizer");

        if (email.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User newUser = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .primaryRole(primaryRole)
                .isActive(true)
                .profileComplete(true)
                .build();

        User savedUser = userRepository.save(newUser);

        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Admin account created: " + email + " with role " + roleName)
                .data(toUserResponse(savedUser))
                .build());
    }

    private UserResponse toUserResponse(User user) {
        String roleName = user.getRole() != null ? user.getRole().getName() : "STUDENT";
        boolean isAdmin = "ADMIN".equalsIgnoreCase(roleName) ||
                           "HACKATHON_ADMIN".equalsIgnoreCase(roleName) ||
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
                .isActive(user.getIsActive())
                .isAdmin(isAdmin)
                .profileComplete(user.getProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
