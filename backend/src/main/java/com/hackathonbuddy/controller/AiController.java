package com.hackathonbuddy.controller;

import com.hackathonbuddy.client.AiServiceClient;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.ProjectIdeaResponse;
import com.hackathonbuddy.dto.response.TeammateMatchResponse;
import com.hackathonbuddy.entity.*;
import com.hackathonbuddy.repository.*;
import com.hackathonbuddy.service.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * AI Hub controller — all AI/ML features are accessed through this controller.
 *
 * DATA FLOW:
 *   React (Axios) → POST /api/ai/find-teammates → Spring Boot → AiServiceClient → Python ML
 *   React (Axios) → GET  /api/ai/skill-gap/{teamId} → Spring Boot → AiServiceClient → Python ML
 *   React (Axios) → POST /api/ai/generate-ideas → Spring Boot → AiServiceClient → Python ML
 *
 * React NEVER talks to Python directly.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiServiceClient aiServiceClient;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserInterestRepository userInterestRepository;
    private final UserExperienceRepository userExperienceRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final ProjectIdeaRepository projectIdeaRepository;
    private final ActivityService activityService;

    private User getUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private List<String> getUserSkillNames(User user) {
        return userSkillRepository.findByUser(user)
                .stream()
                .map(us -> us.getSkill().getName())
                .collect(Collectors.toList());
    }

    /**
     * Build a full profile map for a user (for sending to Python ML service).
     */
    private Map<String, Object> buildUserProfilePayload(User user) {
        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        List<UserInterest> userInterests = userInterestRepository.findByUser(user);
        Optional<UserExperience> userExperience = userExperienceRepository.findByUser(user);
        Optional<UserPreference> userPreference = userPreferenceRepository.findByUser(user);

        Map<String, Object> profile = new HashMap<>();
        profile.put("userId", user.getId());
        profile.put("name", user.getFirstName() + " " + user.getLastName());
        profile.put("email", user.getEmail());

        // Skills with proficiency
        List<Map<String, Object>> skills = userSkills.stream().map(us -> {
            Map<String, Object> s = new HashMap<>();
            s.put("name", us.getSkill().getName());
            s.put("category", us.getSkill().getCategory());
            s.put("proficiencyLevel", us.getProficiencyLevel());
            return s;
        }).collect(Collectors.toList());
        profile.put("skills", skills);
        profile.put("skillNames", userSkills.stream().map(us -> us.getSkill().getName()).collect(Collectors.toList()));

        // Interests
        profile.put("interests", userInterests.stream().map(UserInterest::getInterest).collect(Collectors.toList()));

        // Experience
        userExperience.ifPresent(exp -> {
            profile.put("yearsOfExperience", exp.getYearsOfExperience());
            profile.put("projectCount", exp.getProjectCount());
            profile.put("hasInternship", exp.getHasInternship());
            profile.put("certifications", exp.getCertifications());
        });

        // Preferences
        userPreference.ifPresent(pref -> {
            profile.put("preferredRole", pref.getPreferredRole());
            profile.put("preferredDomains", pref.getPreferredDomains());
            profile.put("bio", pref.getBio());
            profile.put("location", pref.getLocation());
            profile.put("profilePhotoUrl", pref.getProfilePhotoUrl());
        });

        return profile;
    }

    /**
     * Teammate Matching — delegates to Python ML service with FULL profile data
     * POST /api/ai/find-teammates
     */
    @PostMapping("/find-teammates")
    public ResponseEntity<ApiResponse<List<TeammateMatchResponse>>> findTeammates(
            @RequestParam(required = false) Long hackathonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);

        log.info("AI teammate matching for user: {}", user.getEmail());

        // Build full profile for requesting user
        Map<String, Object> userProfile = buildUserProfilePayload(user);

        // Load ALL other users with profileComplete = true
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> candidateProfiles = allUsers.stream()
                .filter(u -> !u.getId().equals(user.getId()))
                .filter(u -> Boolean.TRUE.equals(u.getProfileComplete()))
                .map(this::buildUserProfilePayload)
                .collect(Collectors.toList());

        log.info("Found {} candidate profiles for matching", candidateProfiles.size());

        // Call Python ML service with full profile data
        List<Map<String, Object>> rawMatches = aiServiceClient.findCompatibleTeammates(
                userProfile, candidateProfiles, hackathonId != null ? hackathonId : 0L);

        // Map to TeammateMatchResponse DTOs
        List<TeammateMatchResponse> matches = rawMatches.stream().map(m -> {
            TeammateMatchResponse resp = TeammateMatchResponse.builder()
                    .userId(toLong(m.get("userId")))
                    .name((String) m.getOrDefault("name", "Unknown"))
                    .profilePhotoUrl((String) m.get("profilePhotoUrl"))
                    .preferredRole((String) m.get("preferredRole"))
                    .bio((String) m.get("bio"))
                    .yearsOfExperience(toInt(m.get("yearsOfExperience")))
                    .projectCount(toInt(m.get("projectCount")))
                    .skills(toStringList(m.get("skills")))
                    .interests(toStringList(m.get("interests")))
                    .compatibilityScore(toDouble(m.get("compatibilityScore")))
                    .commonSkills(toStringList(m.get("commonSkills")))
                    .complementarySkills(toStringList(m.get("complementarySkills")))
                    .matchReason((String) m.getOrDefault("matchReason", ""))
                    .build();
            return resp;
        }).collect(Collectors.toList());

        activityService.logActivity(user, "MATCH",
                "AI teammate matching initiated — " + matches.size() + " potential matches found");

        return ResponseEntity.ok(ApiResponse.<List<TeammateMatchResponse>>builder()
                .success(true)
                .message("Teammate matching complete — " + matches.size() + " matches found")
                .data(matches)
                .build());
    }

    /**
     * Skill Gap Analysis — delegates to Python ML service
     * GET /api/ai/skill-gap/{teamId}
     */
    @GetMapping("/skill-gap/{teamId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analyzeSkillGap(
            @PathVariable Long teamId,
            @RequestParam(required = false) Long hackathonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<String> skills = getUserSkillNames(user);

        // Required skills for the hackathon (default to common hackathon skills)
        List<String> requiredSkills = List.of("React", "Spring Boot", "Python", "Docker", "AWS");

        log.info("AI skill gap analysis for team: {}", teamId);

        Map<String, Object> result = aiServiceClient.analyzeSkillGap(skills, requiredSkills);

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Skill gap analysis complete")
                .data(result)
                .build());
    }

    /**
     * Project Idea Generation — delegates to Python ML service, persists results in MySQL
     * POST /api/ai/generate-ideas
     */
    @PostMapping("/generate-ideas")
    public ResponseEntity<ApiResponse<List<ProjectIdeaResponse>>> generateIdeas(
            @RequestParam(required = false) Long hackathonId,
            @RequestParam(defaultValue = "General") String category,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<String> skills = getUserSkillNames(user);

        log.info("AI idea generation for user: {} | hackathon: {}", user.getEmail(), hackathonId);

        // Call Python ML service
        List<Map<String, Object>> aiIdeas = aiServiceClient.generateProjectIdeas(skills, hackathonId, category);

        List<ProjectIdeaResponse> responses;

        if (!aiIdeas.isEmpty()) {
            // Persist AI-generated ideas to MySQL via Spring Boot
            responses = aiIdeas.stream().map(idea -> {
                ProjectIdea entity = ProjectIdea.builder()
                        .title((String) idea.getOrDefault("title", "Untitled Idea"))
                        .description((String) idea.getOrDefault("description", ""))
                        .techStack((String) idea.getOrDefault("techStack", ""))
                        .problemStatement((String) idea.getOrDefault("problemStatement", ""))
                        .category(category)
                        .aiConfidenceScore(((Number) idea.getOrDefault("confidenceScore", 80)).intValue())
                        .generatedFor(user)
                        .build();
                entity = projectIdeaRepository.save(entity);
                return toIdeaResponse(entity);
            }).collect(Collectors.toList());
        } else {
            // Fallback: use a seeded idea when Python ML is not yet running
            ProjectIdea fallback = projectIdeaRepository.save(ProjectIdea.builder()
                    .title("Smart Hackathon Assistant")
                    .description("An AI-powered assistant that helps participants navigate hackathons, find teammates, and manage deadlines.")
                    .techStack("React, Spring Boot, Python, TensorFlow, MySQL")
                    .problemStatement("Hackathon participants struggle with team formation, idea validation, and time management.")
                    .category(category)
                    .aiConfidenceScore(88)
                    .generatedFor(user)
                    .build());
            responses = List.of(toIdeaResponse(fallback));
        }

        activityService.logActivity(user, "IDEA",
                "Generated " + responses.size() + " project idea(s) via AI",
                hackathonId != null ? hackathonId.toString() : null, "HACKATHON");

        return ResponseEntity.ok(ApiResponse.<List<ProjectIdeaResponse>>builder()
                .success(true)
                .message(aiIdeas.isEmpty()
                        ? "Idea generated (ML service offline — fallback used)"
                        : "Ideas generated by Python ML service")
                .data(responses)
                .build());
    }

    /**
     * Match Score — compute compatibility between user's skills and a hackathon
     * GET /api/ai/match-score/{hackathonId}
     */
    @GetMapping("/match-score/{hackathonId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMatchScore(
            @PathVariable Long hackathonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<String> skills = getUserSkillNames(user);

        int score = aiServiceClient.getMatchScore(skills, hackathonId);

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Match score computed")
                .data(Map.of(
                        "hackathonId", hackathonId,
                        "matchScore", score,
                        "userSkillCount", skills.size(),
                        "aiPowered", true
                ))
                .build());
    }

    // ─── HELPERS ────────────────────────────────────────────────────────

    private ProjectIdeaResponse toIdeaResponse(ProjectIdea idea) {
        return ProjectIdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .description(idea.getDescription())
                .techStack(idea.getTechStack())
                .problemStatement(idea.getProblemStatement())
                .category(idea.getCategory())
                .aiConfidenceScore(idea.getAiConfidenceScore())
                .generatedAt(idea.getGeneratedAt() != null ? idea.getGeneratedAt().toString() : null)
                .build();
    }

    private Long toLong(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) return ((Number) obj).longValue();
        try { return Long.parseLong(obj.toString()); } catch (Exception e) { return null; }
    }

    private Integer toInt(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Number) return ((Number) obj).intValue();
        try { return Integer.parseInt(obj.toString()); } catch (Exception e) { return 0; }
    }

    private Double toDouble(Object obj) {
        if (obj == null) return 0.0;
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        try { return Double.parseDouble(obj.toString()); } catch (Exception e) { return 0.0; }
    }

    @SuppressWarnings("unchecked")
    private List<String> toStringList(Object obj) {
        if (obj instanceof List) return (List<String>) obj;
        return List.of();
    }
}
