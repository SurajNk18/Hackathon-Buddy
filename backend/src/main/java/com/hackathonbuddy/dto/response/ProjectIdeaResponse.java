package com.hackathonbuddy.dto.response;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectIdeaResponse {
    private Long id;
    private String title;
    private String description;
    private String techStack;
    private String problemStatement;
    private String category;
    private Integer aiConfidenceScore;
    private String generatedAt;
}
