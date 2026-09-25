package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.request.LoginRequest;
import com.hackathonbuddy.dto.request.RegisterRequest;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.AuthResponse;
import com.hackathonbuddy.dto.response.UserResponse;
import com.hackathonbuddy.entity.Role;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.entity.UserSkill;
import com.hackathonbuddy.exception.ResourceNotFoundException;
import com.hackathonbuddy.exception.UnauthorizedException;
import com.hackathonbuddy.exception.UserAlreadyExistsException;
import com.hackathonbuddy.repository.RoleRepository;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.repository.UserSkillRepository;
import com.hackathonbuddy.security.JwtService;
import com.hackathonbuddy.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSkillRepository userSkillRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public ApiResponse<AuthResponse> register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new UserAlreadyExistsException(normalizedEmail);
        }

        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "STUDENT"));

        // Handle fullName → firstName + lastName split
        String firstName = request.getFirstName();
        String lastName = request.getLastName();
        if ((firstName == null || firstName.isBlank()) && request.getFullName() != null) {
            String[] parts = request.getFullName().trim().split("\\s+", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : "";
        }
        if (firstName == null) firstName = "";
        if (lastName == null) lastName = "";

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(studentRole)
                .primaryRole(request.getPrimaryRole())
                .location(request.getLocation())
                .githubUrl(request.getGithubUrl())
                .profileComplete(true)
                .build();

        User savedUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().getName());

        UserResponse userResponse = buildUserResponse(savedUser);

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwtToken)
                .user(userResponse)
                .build();

        return ApiResponse.success("User registered successfully", authResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AuthResponse> login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("User account is disabled");
        }

        String jwtToken = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().getName());

        UserResponse userResponse = buildUserResponse(user);

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwtToken)
                .user(userResponse)
                .build();

        return ApiResponse.success("Login successful", authResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<UserResponse> getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        UserResponse userResponse = buildUserResponse(user);

        return ApiResponse.success("Current user fetched successfully", userResponse);
    }

    /**
     * Build a rich UserResponse matching what the frontend expects.
     */
    private UserResponse buildUserResponse(User user) {
        // Get user's skills from the UserSkill table
        List<String> skillNames = List.of();
        try {
            skillNames = userSkillRepository.findByUser(user)
                    .stream()
                    .map(us -> us.getSkill().getName())
                    .collect(Collectors.toList());
        } catch (Exception ignored) {
            // Skills may not be populated yet
        }

        boolean isAdmin = user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getName());

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().getName() : "STUDENT")
                .primaryRole(user.getPrimaryRole())
                .location(user.getLocation())
                .bio(user.getBio())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .skills(skillNames)
                .domains(List.of())
                .isActive(user.getIsActive())
                .isAdmin(isAdmin)
                .profileComplete(user.getProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
