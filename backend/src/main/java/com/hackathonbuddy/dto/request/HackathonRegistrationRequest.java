package com.hackathonbuddy.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HackathonRegistrationRequest {
    private String teamName;
    private String role;
    private String motivation;
}
