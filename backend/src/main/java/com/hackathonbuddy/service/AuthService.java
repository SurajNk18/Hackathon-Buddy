package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.request.LoginRequest;
import com.hackathonbuddy.dto.request.RegisterRequest;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.AuthResponse;
import com.hackathonbuddy.dto.response.UserResponse;

public interface AuthService {
    ApiResponse<AuthResponse> register(RegisterRequest request);
    ApiResponse<AuthResponse> login(LoginRequest request);
    ApiResponse<UserResponse> getCurrentUser(String email);
}
