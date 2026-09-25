package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.request.CreateHackathonRequest;
import com.hackathonbuddy.dto.response.HackathonResponse;
import com.hackathonbuddy.entity.User;
import java.util.List;

public interface HackathonService {
    List<HackathonResponse> getAllHackathons(User currentUser);
    List<HackathonResponse> getRecommendedHackathons(User currentUser);
    List<HackathonResponse> getUpcomingHackathons(User currentUser);
    HackathonResponse getHackathonById(Long id, User currentUser);
    HackathonResponse createHackathon(CreateHackathonRequest request);
    void deleteHackathon(Long id);
    HackathonResponse updateHackathonStatus(Long id, String status);
}
