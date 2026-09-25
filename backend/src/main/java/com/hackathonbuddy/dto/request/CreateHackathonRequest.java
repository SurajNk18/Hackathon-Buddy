package com.hackathonbuddy.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateHackathonRequest {
    private String title;
    private String description;
    private String category;
    private String date;
    private String deadline;
    private String prize;
    private Integer participants;
    private String location;
    private String duration;
    private String status;
    private String level;
}
