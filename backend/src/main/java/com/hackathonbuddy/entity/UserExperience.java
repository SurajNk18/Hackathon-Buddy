package com.hackathonbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    private Integer yearsOfExperience = 0;

    @Builder.Default
    private Integer projectCount = 0;

    @Builder.Default
    private Boolean hasInternship = false;

    @Column(columnDefinition = "TEXT")
    private String certifications; // comma-separated or JSON

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = LocalDateTime.now();
    }
}
