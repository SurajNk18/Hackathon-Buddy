package com.hackathonbuddy.dto.request;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInterestsRequest {
    private List<String> interests;
}
