package com.hackathonbuddy.provider.impl;

import com.hackathonbuddy.model.Hackathon;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestOperations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class DevpostHackathonProviderTest {

    private RestOperations restTemplate;
    private DevpostHackathonProvider provider;

    @BeforeEach
    void setUp() {
        restTemplate = Mockito.mock(RestOperations.class);
        provider = new DevpostHackathonProvider(restTemplate);
    }

    @Test
    void testGetProviderName() {
        assertEquals("Devpost", provider.getProviderName());
    }

    @Test
    void testFetchHackathons_successfulResponse() {
        String mockJsonResponse = """
                {
                  "hackathons": [
                    {
                      "id": 12345,
                      "title": "AI Innovation Challenge",
                      "displayed_prize_amount": "$$<span data-currency-value>5,000</span>",
                      "prize_amount": 5000,
                      "submission_period_dates": "Oct 1 - Oct 30, 2026",
                      "registrations_count": 250,
                      "online_only": true,
                      "open_state": "open",
                      "featured": true,
                      "url": "https://ai-challenge.devpost.com",
                      "icon": "https://devpost.com/icon.png",
                      "themes": [
                        { "name": "Artificial Intelligence" },
                        { "name": "Machine Learning" }
                      ],
                      "organizations": [
                        { "name": "OpenAI" },
                        { "name": "Devpost" }
                      ]
                    }
                  ]
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&per_page=30"),
                eq(HttpMethod.GET),
                ArgumentMatchers.<HttpEntity<Void>>any(),
                eq(String.class)
        )).thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();

        assertNotNull(result);
        assertEquals(1, result.size());

        Hackathon h = result.get(0);
        assertEquals("devpost-12345", h.getId());
        assertEquals("AI Innovation Challenge", h.getTitle());
        assertEquals("Devpost", h.getPlatform());
        assertEquals("https://devpost.com/icon.png", h.getLogo());
        assertEquals("https://ai-challenge.devpost.com", h.getUrl());
        assertEquals("Oct 1 - Oct 30, 2026", h.getDeadline());
        assertEquals("$5,000", h.getPrize());
        assertEquals(250, h.getParticipants());
        assertEquals("Online", h.getMode());
        assertEquals(List.of("Artificial Intelligence", "Machine Learning"), h.getTags());
        assertEquals("Open", h.getStatus());
        assertTrue(h.getFeatured());
        assertEquals("OpenAI, Devpost", h.getOrganizer());
    }

    @Test
    void testFetchHackathons_prizeFallbackToNumeric() {
        String mockJsonResponse = """
                {
                  "hackathons": [
                    {
                      "id": 999,
                      "title": "Fallback Prize Hackathon",
                      "displayed_prize_amount": "$$0",
                      "prize_amount": 1000,
                      "submission_period_dates": "Nov 1 - Nov 15",
                      "registrations_count": 50,
                      "online_only": false,
                      "open_state": "upcoming",
                      "featured": false,
                      "url": "https://devpost.com/fallback",
                      "icon": "https://devpost.com/icon.png",
                      "themes": [],
                      "organizations": []
                    }
                  ]
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                ArgumentMatchers.anyString(),
                eq(HttpMethod.GET),
                ArgumentMatchers.<HttpEntity<Void>>any(),
                eq(String.class)
        )).thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();

        assertEquals(1, result.size());
        Hackathon h = result.get(0);
        assertEquals("$1,000", h.getPrize());
        assertEquals("In-Person / Hybrid", h.getMode());
        assertEquals("Upcoming", h.getStatus());
        assertFalse(h.getFeatured());
        assertNull(h.getOrganizer());
    }

    @Test
    void testFetchHackathons_emptyResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"hackathons\": []}", HttpStatus.OK);
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_malformedResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("NOT_VALID_JSON", HttpStatus.OK);
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_timeout() {
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenThrow(new ResourceAccessException("Read timeout"));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_http500() {
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }
}
