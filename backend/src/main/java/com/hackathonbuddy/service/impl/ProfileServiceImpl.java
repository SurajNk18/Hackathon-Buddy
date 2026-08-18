package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.request.*;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.ProfileResponse;
import com.hackathonbuddy.entity.*;
import com.hackathonbuddy.exception.ResourceNotFoundException;
import com.hackathonbuddy.repository.*;
import com.hackathonbuddy.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserInterestRepository userInterestRepository;
    private final UserExperienceRepository userExperienceRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    // ─── GET PROFILE ────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<ProfileResponse> getProfile(String email) {
        User user = findUser(email);
        ProfileResponse response = buildProfileResponse(user);
        return ApiResponse.success("Profile fetched successfully", response);
    }

    // ─── UPDATE BASIC PROFILE ───────────────────────────────────────────

    @Override
    @Transactional
    public ApiResponse<ProfileResponse> updateProfile(String email, UpdateProfileRequest request) {
        User user = findUser(email);

        UserPreference pref = userPreferenceRepository.findByUser(user)
                .orElse(UserPreference.builder().user(user).build());

        if (request.getBio() != null) pref.setBio(request.getBio());
        if (request.getLocation() != null) pref.setLocation(request.getLocation());
        if (request.getProfilePhotoUrl() != null) pref.setProfilePhotoUrl(request.getProfilePhotoUrl());
        if (request.getPreferredRole() != null) pref.setPreferredRole(request.getPreferredRole());
        if (request.getPreferredDomains() != null) {
            pref.setPreferredDomains(String.join(",", request.getPreferredDomains()));
        }

        userPreferenceRepository.save(pref);
        checkAndUpdateProfileComplete(user);

        return ApiResponse.success("Profile updated successfully", buildProfileResponse(user));
    }

    // ─── SKILLS ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApiResponse<ProfileResponse> addSkill(String email, AddSkillRequest request) {
        User user = findUser(email);

        // Find or create the skill
        Skill skill = skillRepository.findByNameIgnoreCase(request.getSkillName())
                .orElseGet(() -> skillRepository.save(
                        Skill.builder().name(request.getSkillName()).category("Other").build()
                ));

        // Check if already exists
        Optional<UserSkill> existing = userSkillRepository.findByUserAndSkill(user, skill);
        if (existing.isPresent()) {
            // Update proficiency
            existing.get().setProficiencyLevel(request.getProficiencyLevel());
            userSkillRepository.save(existing.get());
        } else {
            UserSkill userSkill = UserSkill.builder()
                    .user(user)
                    .skill(skill)
                    .proficiencyLevel(request.getProficiencyLevel())
                    .build();
            userSkillRepository.save(userSkill);
        }

        checkAndUpdateProfileComplete(user);
        return ApiResponse.success("Skill added successfully", buildProfileResponse(user));
    }

    @Override
    @Transactional
    public ApiResponse<Void> removeSkill(String email, Long skillId) {
        User user = findUser(email);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId.toString()));

        userSkillRepository.findByUserAndSkill(user, skill)
                .ifPresent(userSkillRepository::delete);

        return ApiResponse.success("Skill removed successfully", null);
    }

    // ─── INTERESTS ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApiResponse<ProfileResponse> updateInterests(String email, UpdateInterestsRequest request) {
        User user = findUser(email);

        // Delete existing and re-add
        userInterestRepository.deleteByUser(user);
        userInterestRepository.flush();

        if (request.getInterests() != null) {
            for (String interest : request.getInterests()) {
                userInterestRepository.save(
                        UserInterest.builder().user(user).interest(interest).build()
                );
            }
        }

        checkAndUpdateProfileComplete(user);
        return ApiResponse.success("Interests updated successfully", buildProfileResponse(user));
    }

    // ─── EXPERIENCE ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApiResponse<ProfileResponse> updateExperience(String email, UpdateExperienceRequest request) {
        User user = findUser(email);

        UserExperience exp = userExperienceRepository.findByUser(user)
                .orElse(UserExperience.builder().user(user).build());

        if (request.getYearsOfExperience() != null) exp.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getProjectCount() != null) exp.setProjectCount(request.getProjectCount());
        if (request.getHasInternship() != null) exp.setHasInternship(request.getHasInternship());
        if (request.getCertifications() != null) exp.setCertifications(request.getCertifications());

        userExperienceRepository.save(exp);
        checkAndUpdateProfileComplete(user);

        return ApiResponse.success("Experience updated successfully", buildProfileResponse(user));
    }

    // ─── PROFILE COMPLETE STATUS ────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Boolean> isProfileComplete(String email) {
        User user = findUser(email);
        return ApiResponse.success("Profile status", user.getProfileComplete());
    }

    @Override
    @Transactional
    public ApiResponse<ProfileResponse> completeProfile(String email,
                                                         UpdateProfileRequest profileReq,
                                                         UpdateExperienceRequest experienceReq) {
        // Update preferences
        if (profileReq != null) updateProfile(email, profileReq);
        // Update experience
        if (experienceReq != null) updateExperience(email, experienceReq);

        User user = findUser(email);
        user.setProfileComplete(true);
        userRepository.save(user);

        return ApiResponse.success("Profile completed successfully", buildProfileResponse(user));
    }

    // ─── HELPERS ────────────────────────────────────────────────────────

    private void checkAndUpdateProfileComplete(User user) {
        List<UserSkill> skills = userSkillRepository.findByUser(user);
        List<UserInterest> interests = userInterestRepository.findByUser(user);
        Optional<UserPreference> pref = userPreferenceRepository.findByUser(user);

        boolean hasSkills = !skills.isEmpty();
        boolean hasInterests = !interests.isEmpty();
        boolean hasPreference = pref.isPresent() && pref.get().getPreferredRole() != null;

        boolean complete = hasSkills && hasInterests && hasPreference;

        if (complete != user.getProfileComplete()) {
            user.setProfileComplete(complete);
            userRepository.save(user);
        }
    }

    private ProfileResponse buildProfileResponse(User user) {
        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        List<UserInterest> userInterests = userInterestRepository.findByUser(user);
        Optional<UserExperience> userExperience = userExperienceRepository.findByUser(user);
        Optional<UserPreference> userPref = userPreferenceRepository.findByUser(user);

        // Map skills
        List<ProfileResponse.SkillEntry> skillEntries = userSkills.stream()
                .map(us -> ProfileResponse.SkillEntry.builder()
                        .skillId(us.getSkill().getId())
                        .name(us.getSkill().getName())
                        .category(us.getSkill().getCategory())
                        .proficiencyLevel(us.getProficiencyLevel())
                        .proficiencyLabel(getProficiencyLabel(us.getProficiencyLevel()))
                        .build())
                .collect(Collectors.toList());

        // Map interests
        List<String> interests = userInterests.stream()
                .map(UserInterest::getInterest)
                .collect(Collectors.toList());

        // Map experience
        ProfileResponse.ExperienceEntry expEntry = userExperience.map(exp ->
                ProfileResponse.ExperienceEntry.builder()
                        .yearsOfExperience(exp.getYearsOfExperience())
                        .projectCount(exp.getProjectCount())
                        .hasInternship(exp.getHasInternship())
                        .certifications(exp.getCertifications())
                        .build()
        ).orElse(ProfileResponse.ExperienceEntry.builder()
                .yearsOfExperience(0).projectCount(0).hasInternship(false).build());

        // Map preferences
        List<String> domains = userPref
                .filter(p -> p.getPreferredDomains() != null && !p.getPreferredDomains().isEmpty())
                .map(p -> Arrays.asList(p.getPreferredDomains().split(",")))
                .orElse(List.of());

        return ProfileResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .profileComplete(user.getProfileComplete())
                .bio(userPref.map(UserPreference::getBio).orElse(null))
                .location(userPref.map(UserPreference::getLocation).orElse(null))
                .profilePhotoUrl(userPref.map(UserPreference::getProfilePhotoUrl).orElse(null))
                .preferredRole(userPref.map(UserPreference::getPreferredRole).orElse(null))
                .preferredDomains(domains)
                .skills(skillEntries)
                .interests(interests)
                .experience(expEntry)
                .build();
    }

    private String getProficiencyLabel(Integer level) {
        if (level == null) return "Unknown";
        return switch (level) {
            case 1 -> "Beginner";
            case 2 -> "Intermediate";
            case 3 -> "Advanced";
            default -> "Unknown";
        };
    }
}
