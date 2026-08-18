package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.response.HackathonResponse;
import com.hackathonbuddy.entity.Hackathon;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.HackathonRepository;
import com.hackathonbuddy.repository.RegistrationRepository;
import com.hackathonbuddy.service.HackathonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HackathonServiceImpl implements HackathonService {

    private final HackathonRepository hackathonRepository;
    private final RegistrationRepository registrationRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Override
    public List<HackathonResponse> getAllHackathons(User currentUser) {
        return hackathonRepository.findByIsActiveTrue()
                .stream()
                .map(h -> toResponse(h, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<HackathonResponse> getRecommendedHackathons(User currentUser) {
        // Returns top hackathons - will be AI-ranked in future via Python service
        return hackathonRepository.findRecentHackathons()
                .stream()
                .limit(6)
                .map(h -> toResponseWithRandomMatch(h, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<HackathonResponse> getUpcomingHackathons(User currentUser) {
        return hackathonRepository.findUpcomingHackathons(LocalDate.now())
                .stream()
                .limit(5)
                .map(h -> toResponse(h, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public HackathonResponse getHackathonById(Long id, User currentUser) {
        Hackathon hackathon = hackathonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hackathon not found with id: " + id));
        return toResponse(hackathon, currentUser);
    }

    private HackathonResponse toResponse(Hackathon h, User user) {
        boolean isRegistered = user != null &&
                registrationRepository.existsByUserAndHackathon(user, h);
        return HackathonResponse.builder()
                .id(h.getId())
                .title(h.getTitle())
                .description(h.getDescription())
                .category(h.getCategory())
                .organizer(h.getOrganizer())
                .startDate(h.getStartDate() != null ? h.getStartDate().format(dateFormatter) : null)
                .endDate(h.getEndDate() != null ? h.getEndDate().format(dateFormatter) : null)
                .registrationDeadline(h.getRegistrationDeadline() != null ? h.getRegistrationDeadline().format(dateFormatter) : null)
                .prizePool(h.getPrizePool())
                .location(h.getLocation())
                .mode(h.getMode())
                .maxTeamSize(h.getMaxTeamSize())
                .imageUrl(h.getImageUrl())
                .websiteUrl(h.getWebsiteUrl())
                .isActive(h.getIsActive())
                .matchScore(75)
                .isRegistered(isRegistered)
                .build();
    }

    private HackathonResponse toResponseWithRandomMatch(Hackathon h, User user) {
        // Simulated match scores until Python ML service is integrated
        int[] matchScores = {92, 86, 81, 88, 79, 95};
        Random random = new Random(h.getId());
        int matchScore = matchScores[random.nextInt(matchScores.length)];

        HackathonResponse response = toResponse(h, user);
        response.setMatchScore(matchScore);
        return response;
    }
}
