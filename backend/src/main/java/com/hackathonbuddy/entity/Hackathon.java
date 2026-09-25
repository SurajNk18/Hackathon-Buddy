package com.hackathonbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hackathons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    private String organizer;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;

    private String prizePool;
    private String location;
    private String mode; // ONLINE, OFFLINE, HYBRID

    private Integer maxTeamSize;
    private Integer minTeamSize;

    private String imageUrl;
    private String websiteUrl;

    private String duration;
    private String icon;
    private String color;
    private String type;
    private String level;

    @Builder.Default
    private String status = "Open";

    @Builder.Default
    private Integer participantCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
