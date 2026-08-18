package com.hackathonbuddy.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private HackathonStats hackathons;
    private TeamStats teams;
    private ProjectIdeaStats projectIdeas;
    private SkillMatchStats skillMatch;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HackathonStats {
        private int value;
        private int registered;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TeamStats {
        private int value;
        private int active;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProjectIdeaStats {
        private int value;
        private int generated;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SkillMatchStats {
        private int value;
        private String label;
    }
}
