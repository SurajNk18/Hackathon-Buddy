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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestOperations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class HackerEarthHackathonProviderTest {

    private RestOperations restTemplate;
    private HackerEarthHackathonProvider provider;

    @BeforeEach
    void setUp() {
        restTemplate = Mockito.mock(RestOperations.class);
        provider = new HackerEarthHackathonProvider(restTemplate);
    }

    @Test
    void testGetProviderName() {
        assertEquals("HackerEarth", provider.getProviderName());
    }

    @Test
    void testFetchHackathons_successfulResponse() {
        String mockJsonResponse = """
                {
                  "response": [
                    {
                      "title": "HackerEarth AI Challenge",
                      "thumbnail": "https://hackerearth.com/thumb.png",
                      "url": "https://www.hackerearth.com/challenges/hackathon/ai-challenge-2026/",
                      "end_utc_tz": "2026-11-01T23:59:59Z",
                      "num_registrations": 450,
                      "challenge_type": "Hackathon",
                      "status": "ONGOING",
                      "is_hackerearth": true
                    }
                  ]
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://www.hackerearth.com/chrome-extension/events/"),
                eq(HttpMethod.GET),
                ArgumentMatchers.<HttpEntity<Void>>any(),
                eq(String.class)
        )).thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();

        assertNotNull(result);
        assertEquals(1, result.size());

        Hackathon h = result.get(0);
        assertEquals("hackerearth-ai-challenge-2026", h.getId());
        assertEquals("HackerEarth AI Challenge", h.getTitle());
        assertEquals("HackerEarth", h.getPlatform());
        assertEquals("https://hackerearth.com/thumb.png", h.getLogo());
        assertEquals("https://www.hackerearth.com/challenges/hackathon/ai-challenge-2026/", h.getUrl());
        assertEquals("2026-11-01T23:59:59Z", h.getDeadline());
        assertEquals(450, h.getParticipants());
        assertEquals("Online", h.getMode());
        assertEquals("Open", h.getStatus());
        assertEquals("HackerEarth", h.getOrganizer());
    }

    @Test
    void testFetchHackathons_emptyResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"response\": []}", HttpStatus.OK);
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_malformedResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("NOT_JSON", HttpStatus.OK);
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_timeout() {
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenThrow(new ResourceAccessException("Connection timeout"));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_http500() {
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_missingOptionalFields() {
        String mockJsonResponse = """
                {
                  "response": [
                    {
                      "title": "Minimal Hackathon"
                    }
                  ]
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertEquals(1, result.size());
        assertEquals("Minimal Hackathon", result.get(0).getTitle());
        assertEquals("hackerearth-minimal-hackathon", result.get(0).getId());
    }
}
