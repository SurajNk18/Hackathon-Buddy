package com.hackathonbuddy.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddSkillRequest {
    @NotBlank
    private String skillName;

    @Min(1) @Max(3)
    private Integer proficiencyLevel; // 1=Beginner, 2=Intermediate, 3=Advanced
}
