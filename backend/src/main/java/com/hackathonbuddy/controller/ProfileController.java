package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.request.*;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.ProfileResponse;
import com.hackathonbuddy.entity.Skill;
import com.hackathonbuddy.repository.SkillRepository;
import com.hackathonbuddy.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Profile Controller — manages user profile, skills, interests, experience.
 *
 * GET  /api/profile              — get full profile
 * PUT  /api/profile              — update basic info + preferences
 * GET  /api/profile/skills       — list user's skills
 * POST /api/profile/skills       — add skill with proficiency
 * DELETE /api/profile/skills/{id} — remove skill
 * PUT  /api/profile/interests    — update interests
 * PUT  /api/profile/experience   — update experience
 * GET  /api/profile/complete-status — check completion
 * POST /api/profile/complete     — mark profile as complete
 * GET  /api/skills/catalog       — list all available skills
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final SkillRepository skillRepository;

    // ─── PROFILE ────────────────────────────────────────────────────────

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getUsername(), request));
    }

    // ─── SKILLS ─────────────────────────────────────────────────────────

    @PostMapping("/profile/skills")
    public ResponseEntity<ApiResponse<ProfileResponse>> addSkill(
            @Valid @RequestBody AddSkillRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.addSkill(userDetails.getUsername(), request));
    }

    @DeleteMapping("/profile/skills/{skillId}")
    public ResponseEntity<ApiResponse<Void>> removeSkill(
            @PathVariable Long skillId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.removeSkill(userDetails.getUsername(), skillId));
    }

    // ─── INTERESTS ──────────────────────────────────────────────────────

    @PutMapping("/profile/interests")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateInterests(
            @RequestBody UpdateInterestsRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.updateInterests(userDetails.getUsername(), request));
    }

    // ─── EXPERIENCE ─────────────────────────────────────────────────────

    @PutMapping("/profile/experience")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateExperience(
            @RequestBody UpdateExperienceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.updateExperience(userDetails.getUsername(), request));
    }

    // ─── PROFILE COMPLETION ─────────────────────────────────────────────

    @GetMapping("/profile/complete-status")
    public ResponseEntity<ApiResponse<Boolean>> getProfileCompleteStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.isProfileComplete(userDetails.getUsername()));
    }

    @PostMapping("/profile/complete")
    public ResponseEntity<ApiResponse<ProfileResponse>> completeProfile(
            @RequestBody(required = false) UpdateProfileRequest profileReq,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.completeProfile(
                userDetails.getUsername(), profileReq, null));
    }

    // ─── SKILLS CATALOG ─────────────────────────────────────────────────

    @GetMapping("/skills/catalog")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkillsCatalog() {
        List<Skill> skills = skillRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Skills catalog", skills));
    }
}
