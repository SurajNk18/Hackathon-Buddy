package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.response.HackathonPageResponse;
import com.hackathonbuddy.model.Hackathon;
import com.hackathonbuddy.provider.HackathonProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class HackathonAggregationServiceTest {

    private HackathonProvider devpostProvider;
    private HackathonProvider devfolioProvider;
    private HackathonProvider failingProvider;
    private HackathonAggregationService aggregationService;

    @BeforeEach
    void setUp() {
        devpostProvider = new HackathonProvider() {
            @Override
            public String getProviderName() {
                return "Devpost";
            }

            @Override
            public List<Hackathon> fetchHackathons() {
                return List.of(
                        Hackathon.builder()
                                .id("devpost-1")
                                .title("AI Global Hackathon")
                                .platform("Devpost")
                                .deadline("2026-10-20")
                                .status("Open")
                                .mode("Online")
                                .tags(List.of("AI", "Python"))
                                .organizer("Devpost Org")
                                .build(),
                        Hackathon.builder()
                                .id("devpost-2")
                                .title("Web Dev Summit")
                                .platform("Devpost")
                                .deadline("2026-11-01")
                                .status("Upcoming")
                                .mode("In-Person")
                                .tags(List.of("Web", "React"))
                                .organizer("Frontend Org")
                                .build()
                );
            }
        };

        devfolioProvider = new HackathonProvider() {
            @Override
            public String getProviderName() {
                return "Devfolio";
            }

            @Override
            public List<Hackathon> fetchHackathons() {
                return List.of(
                        Hackathon.builder()
                                .id("devfolio-1")
                                .title("ETHIndia 2026")
                                .platform("Devfolio")
                                .deadline("2026-12-01")
                                .status("Open")
                                .mode("In-Person")
                                .tags(List.of("Web3", "Ethereum"))
                                .organizer("Devfolio Org")
                                .build()
                );
            }
        };

        failingProvider = new HackathonProvider() {
            @Override
            public String getProviderName() {
                return "HackerEarth";
            }

            @Override
            public List<Hackathon> fetchHackathons() {
                throw new RuntimeException("Network timeout fetching HackerEarth");
            }
        };

        aggregationService = new HackathonAggregationService(List.of(devpostProvider, devfolioProvider, failingProvider));
    }

    @Test
    void testFetchAndAggregate_allProvidersWithPartialFailure() {
        HackathonPageResponse response = aggregationService.fetchAndAggregate(
                null, null, null, null, null, "deadline", "asc", 0, 10);

        assertNotNull(response);
        assertEquals(3, response.getTotalElements());
        assertEquals(3, response.getContent().size());

        // Verify provider metadata tracked status
        assertTrue(response.getProviders().get("devpost").isSuccess());
        assertEquals(2, response.getProviders().get("devpost").getCount());

        assertTrue(response.getProviders().get("devfolio").isSuccess());
        assertEquals(1, response.getProviders().get("devfolio").getCount());

        assertFalse(response.getProviders().get("hackerearth").isSuccess());
        assertEquals("Network timeout fetching HackerEarth", response.getProviders().get("hackerearth").getError());
    }

    @Test
    void testFetchAndAggregate_platformFiltering() {
        HackathonPageResponse response = aggregationService.fetchAndAggregate(
                List.of("devpost"), null, null, null, null, "deadline", "asc", 0, 10);

        assertEquals(2, response.getTotalElements());
        assertTrue(response.getContent().stream().allMatch(h -> "Devpost".equalsIgnoreCase(h.getPlatform())));
        assertFalse(response.getProviders().containsKey("devfolio"));
    }

    @Test
    void testFetchAndAggregate_searchFiltering() {
        HackathonPageResponse response = aggregationService.fetchAndAggregate(
                null, null, "AI", null, null, "deadline", "asc", 0, 10);

        assertEquals(1, response.getTotalElements());
        assertEquals("AI Global Hackathon", response.getContent().get(0).getTitle());
    }

    @Test
    void testFetchAndAggregate_pagination() {
        HackathonPageResponse page1 = aggregationService.fetchAndAggregate(
                null, null, null, null, null, "deadline", "asc", 0, 2);

        assertEquals(3, page1.getTotalElements());
        assertEquals(2, page1.getContent().size());
        assertEquals(2, page1.getTotalPages());

        HackathonPageResponse page2 = aggregationService.fetchAndAggregate(
                null, null, null, null, null, "deadline", "asc", 1, 2);

        assertEquals(1, page2.getContent().size());
    }
}
