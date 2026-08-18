package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.ProjectIdeaResponse;
import com.hackathonbuddy.entity.ProjectIdea;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.ProjectIdeaRepository;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectIdeaRepository projectIdeaRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    private User getUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<ProjectIdeaResponse>>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<ProjectIdeaResponse> ideas = projectIdeaRepository
                .findByGeneratedForOrderByGeneratedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<ProjectIdeaResponse>>builder()
                .success(true).message("Project ideas retrieved").data(ideas).build());
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ProjectIdeaResponse>> generateIdea(
            @RequestParam(required = false) Long hackathonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        // Placeholder: actual generation handled by Python ML service
        ProjectIdea idea = ProjectIdea.builder()
                .title("AI Study Assistant")
                .description("An intelligent study companion that adapts to learning styles")
                .techStack("Python, TensorFlow, React, FastAPI")
                .problemStatement("Students struggle with personalized learning")
                .category("AI/ML")
                .aiConfidenceScore(92)
                .generatedFor(user)
                .build();
        idea = projectIdeaRepository.save(idea);
        activityService.logActivity(user, "IDEA",
                "Project idea generated: " + idea.getTitle(),
                idea.getId().toString(), "PROJECT_IDEA");
        return ResponseEntity.ok(ApiResponse.<ProjectIdeaResponse>builder()
                .success(true).message("Project idea generated").data(toResponse(idea)).build());
    }

    private ProjectIdeaResponse toResponse(ProjectIdea idea) {
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
}
