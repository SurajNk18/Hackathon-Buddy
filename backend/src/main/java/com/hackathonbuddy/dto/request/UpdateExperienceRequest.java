package com.hackathonbuddy.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateExperienceRequest {
    private Integer yearsOfExperience;
    private Integer projectCount;
    private Boolean hasInternship;
    private String certifications;
}
