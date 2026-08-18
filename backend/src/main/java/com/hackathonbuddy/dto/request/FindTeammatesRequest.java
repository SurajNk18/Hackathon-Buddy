package com.hackathonbuddy.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FindTeammatesRequest {
    private Long hackathonId;
    private Long teamId;
}
