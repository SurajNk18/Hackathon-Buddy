package com.hackathonbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeamRequest {
    @NotBlank
    private String name;
    private String description;
    private Long hackathonId;
}
