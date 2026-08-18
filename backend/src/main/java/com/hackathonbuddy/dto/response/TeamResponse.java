package com.hackathonbuddy.dto.response;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private TeamMemberResponse leader;
    private List<TeamMemberResponse> members;
    private Integer skillCoveragePercent;
    private List<String> missingSkills;
    private Boolean isActive;
}
