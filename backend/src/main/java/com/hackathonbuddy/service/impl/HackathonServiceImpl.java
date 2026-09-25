package com.hackathonbuddy.service.impl;

import com.hackathonbuddy.dto.request.CreateHackathonRequest;
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

    @Override
    public HackathonResponse createHackathon(CreateHackathonRequest request) {
        Hackathon hackathon = Hackathon.builder()
                .title(request.getTitle())
                .description(request.getDescription() != null ? request.getDescription() : "Exciting hackathon challenge with mentorship and prizes.")
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .prizePool(request.getPrize() != null ? request.getPrize() : "₹1,00,000")
                .location(request.getLocation() != null ? request.getLocation() : "Online")
                .duration(request.getDuration() != null ? request.getDuration() : "48 Hours")
                .status(request.getStatus() != null ? request.getStatus() : "Open")
                .level(request.getLevel() != null ? request.getLevel() : "All Levels")
                .participantCount(request.getParticipants() != null ? request.getParticipants() : 0)
                .color("purple")
                .icon("🚀")
                .type("ai")
                .isActive(true)
                .build();

        hackathon = hackathonRepository.save(hackathon);
        return toResponse(hackathon, null);
    }

    @Override
    public void deleteHackathon(Long id) {
        hackathonRepository.deleteById(id);
    }

    @Override
    public HackathonResponse updateHackathonStatus(Long id, String status) {
        Hackathon hackathon = hackathonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hackathon not found with id: " + id));
        hackathon.setStatus(status);
        hackathon = hackathonRepository.save(hackathon);
        return toResponse(hackathon, null);
    }

    private HackathonResponse toResponse(Hackathon h, User user) {
        boolean isRegistered = user != null &&
                registrationRepository.existsByUserAndHackathon(user, h);

        // Compute match score
        int[] matchScores = {94, 86, 81, 78, 74, 88};
        Random random = new Random(h.getId() != null ? h.getId() : 1L);
        int matchScore = matchScores[random.nextInt(matchScores.length)];

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
                .matchScore(matchScore)
                .isRegistered(isRegistered)
                // Frontend-compatible fields
                .date(h.getStartDate() != null ? h.getStartDate().format(dateFormatter) : null)
                .deadline(h.getRegistrationDeadline() != null ? h.getRegistrationDeadline().format(dateFormatter) : null)
                .prize(h.getPrizePool())
                .participants(h.getParticipantCount() != null ? h.getParticipantCount() : 0)
                .duration(h.getDuration())
                .match(matchScore)
                .status(h.getStatus() != null ? h.getStatus() : "Open")
                .level(h.getLevel())
                .color(h.getColor())
                .icon(h.getIcon())
                .type(h.getType())
                .build();
    }

    private HackathonResponse toResponseWithRandomMatch(Hackathon h, User user) {
        int[] matchScores = {92, 86, 81, 88, 79, 95};
        Random random = new Random(h.getId());
        int matchScore = matchScores[random.nextInt(matchScores.length)];

        HackathonResponse response = toResponse(h, user);
        response.setMatchScore(matchScore);
        response.setMatch(matchScore);
        return response;
    }
}
