package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.dto.response.HackathonPageResponse;
import com.hackathonbuddy.model.Hackathon;
import com.hackathonbuddy.provider.HackathonProvider;
import com.hackathonbuddy.repository.UserRepository;
import com.hackathonbuddy.service.HackathonAggregationService;
import com.hackathonbuddy.service.HackathonService;
import com.hackathonbuddy.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class HackathonControllerTest {

    private HackathonService hackathonService;
    private HackathonAggregationService aggregationService;
    private UserRepository userRepository;
    private NotificationService notificationService;
    private HackathonController controller;

    @BeforeEach
    void setUp() {
        hackathonService = Mockito.mock(HackathonService.class);
        userRepository = Mockito.mock(UserRepository.class);
        notificationService = Mockito.mock(NotificationService.class);

        HackathonProvider testProvider = new HackathonProvider() {
            @Override
            public String getProviderName() {
                return "Devpost";
            }

            @Override
            public List<Hackathon> fetchHackathons() {
                return List.of(
                        Hackathon.builder()
                                .id("devpost-1001")
                                .title("Global AI Hackathon")
                                .platform("Devpost")
                                .status("Open")
                                .mode("Online")
                                .tags(List.of("AI"))
                                .organizer("AI Org")
                                .build()
                );
            }
        };

        aggregationService = new HackathonAggregationService(List.of(testProvider));
        controller = new HackathonController(hackathonService, aggregationService, userRepository, notificationService);
    }

    @Test
    void testGetExternalHackathons_withQueryParameters() {
        ResponseEntity<ApiResponse<HackathonPageResponse>> response = controller.getExternalHackathons(
                List.of("devpost"), "open", "AI", null, null, "deadline", "asc", 0, 20);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        HackathonPageResponse page = response.getBody().getData();
        assertEquals(1, page.getTotalElements());
        assertEquals("devpost-1001", page.getContent().get(0).getId());
    }
}
