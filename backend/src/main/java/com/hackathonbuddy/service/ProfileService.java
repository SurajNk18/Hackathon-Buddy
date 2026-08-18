package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.request.*;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.ProfileResponse;

public interface ProfileService {
    ApiResponse<ProfileResponse> getProfile(String email);
    ApiResponse<ProfileResponse> updateProfile(String email, UpdateProfileRequest request);
    ApiResponse<ProfileResponse> addSkill(String email, AddSkillRequest request);
    ApiResponse<Void> removeSkill(String email, Long skillId);
    ApiResponse<ProfileResponse> updateInterests(String email, UpdateInterestsRequest request);
    ApiResponse<ProfileResponse> updateExperience(String email, UpdateExperienceRequest request);
    ApiResponse<Boolean> isProfileComplete(String email);
    ApiResponse<ProfileResponse> completeProfile(String email, UpdateProfileRequest profileReq,
                                                  UpdateExperienceRequest experienceReq);
}
