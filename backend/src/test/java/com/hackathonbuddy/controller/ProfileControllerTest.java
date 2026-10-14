package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.ProfileResponse;
import com.hackathonbuddy.repository.SkillRepository;
import com.hackathonbuddy.service.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    @Mock
    private ProfileService profileService;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private UserDetails userDetails;

    private ProfileController profileController;

    @BeforeEach
    void setUp() {
        profileController = new ProfileController(profileService, skillRepository);
    }

    @Test
    void testGetProfile_StudentRole() {
        when(userDetails.getUsername()).thenReturn("student@example.com");
        ProfileResponse studentProfile = ProfileResponse.builder()
                .userId(1L)
                .email("student@example.com")
                .role("STUDENT")
                .preferredRole("Full Stack Developer")
                .build();
        when(profileService.getProfile("student@example.com"))
                .thenReturn(ApiResponse.success("Profile fetched successfully", studentProfile));

        ResponseEntity<ApiResponse<ProfileResponse>> response = profileController.getProfile(userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("STUDENT", response.getBody().getData().getRole());
    }

    @Test
    void testGetProfile_AdminRole() {
        when(userDetails.getUsername()).thenReturn("admin@hackathonbuddy.com");
        ProfileResponse adminProfile = ProfileResponse.builder()
                .userId(2L)
                .email("admin@hackathonbuddy.com")
                .role("ADMIN")
                .preferredRole("Platform Administrator")
                .build();
        when(profileService.getProfile("admin@hackathonbuddy.com"))
                .thenReturn(ApiResponse.success("Profile fetched successfully", adminProfile));

        ResponseEntity<ApiResponse<ProfileResponse>> response = profileController.getProfile(userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("ADMIN", response.getBody().getData().getRole());
    }

    @Test
    void testGetProfile_SuperAdminRole() {
        when(userDetails.getUsername()).thenReturn("superadmin@hackathonbuddy.com");
        ProfileResponse superAdminProfile = ProfileResponse.builder()
                .userId(3L)
                .email("superadmin@hackathonbuddy.com")
                .role("SUPER_ADMIN")
                .preferredRole("Main Developer / System Owner")
                .build();
        when(profileService.getProfile("superadmin@hackathonbuddy.com"))
                .thenReturn(ApiResponse.success("Profile fetched successfully", superAdminProfile));

        ResponseEntity<ApiResponse<ProfileResponse>> response = profileController.getProfile(userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("SUPER_ADMIN", response.getBody().getData().getRole());
    }
}
