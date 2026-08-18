package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.request.LoginRequest;
import com.hackathonbuddy.dto.request.RegisterRequest;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.AuthResponse;
import com.hackathonbuddy.dto.response.UserResponse;
import com.hackathonbuddy.entity.Role;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.exception.ResourceNotFoundException;
import com.hackathonbuddy.exception.UnauthorizedException;
import com.hackathonbuddy.exception.UserAlreadyExistsException;
import com.hackathonbuddy.repository.RoleRepository;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.security.JwtService;
import com.hackathonbuddy.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
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

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(studentRole)
                .build();

        User savedUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().getName());

        UserResponse userResponse = UserResponse.builder()
                .id(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole().getName())
                .isActive(savedUser.getIsActive())
                .profileComplete(savedUser.getProfileComplete())
                .createdAt(savedUser.getCreatedAt())
                .build();

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

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .profileComplete(user.getProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();

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

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .profileComplete(user.getProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();

        return ApiResponse.success("Current user fetched successfully", userResponse);
    }
}
