package com.hackathonbuddy.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMemberResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String status;
    private Boolean isCurrentUser;
}
