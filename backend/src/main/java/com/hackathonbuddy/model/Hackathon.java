package com.hackathonbuddy.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Hackathon {
    private String id;
    private String title;
    private String platform;
    private String logo;
    private String url;
    private String deadline;
    private String prize;
    private Integer participants;
    private String mode;
    private List<String> tags;
    private String status;
    private Boolean featured;
    private String organizer;

    public Hackathon() {
    }

    public Hackathon(String id, String title, String platform, String logo, String url,
                     String deadline, String prize, Integer participants, String mode,
                     List<String> tags, String status, Boolean featured, String organizer) {
        this.id = id;
        this.title = title;
        this.platform = platform;
        this.logo = logo;
        this.url = url;
        this.deadline = deadline;
        this.prize = prize;
        this.participants = participants;
        this.mode = mode;
        this.tags = tags;
        this.status = status;
        this.featured = featured;
        this.organizer = organizer;
    }
}
