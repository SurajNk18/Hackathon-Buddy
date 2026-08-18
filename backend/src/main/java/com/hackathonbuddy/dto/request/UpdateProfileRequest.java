package com.hackathonbuddy.dto.request;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String bio;
    private String location;
    private String profilePhotoUrl;
    private String preferredRole;
    private List<String> preferredDomains;
}
