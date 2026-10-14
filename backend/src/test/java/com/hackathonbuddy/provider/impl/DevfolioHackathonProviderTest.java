package com.hackathonbuddy.provider.impl;

import com.hackathonbuddy.model.Hackathon;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestOperations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class DevfolioHackathonProviderTest {

    private RestOperations restTemplate;
    private DevfolioHackathonProvider provider;

    @BeforeEach
    void setUp() {
        restTemplate = Mockito.mock(RestOperations.class);
        provider = new DevfolioHackathonProvider(restTemplate);
    }

    @Test
    void testGetProviderName() {
        assertEquals("Devfolio", provider.getProviderName());
    }

    @Test
    void testFetchHackathons_dataResultsWrapper() {
        String mockJsonResponse = """
                {
                  "data": {
                    "results": [
                      {
                        "id": "hack-eth-2026",
                        "slug": "ethindia2026",
                        "name": "ETHIndia 2026",
                        "logo_url": "https://devfolio.co/logo.png",
                        "site_url": "https://ethindia.devfolio.co",
                        "submission_period_dates": "Dec 1 - Dec 3, 2026",
                        "prize": "$20,000",
                        "participants_count": 1500,
                        "is_online": false,
                        "status": "open",
                        "featured": true,
                        "organizer": "Devfolio Team"
                      }
                    ]
                  }
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(
                eq("https://api.devfolio.co/api/search/hackathons"),
                ArgumentMatchers.<HttpEntity<String>>any(),
                eq(String.class)
        )).thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();

        assertNotNull(result);
        assertEquals(1, result.size());

        Hackathon h = result.get(0);
        assertEquals("devfolio-hack-eth-2026", h.getId());
        assertEquals("ETHIndia 2026", h.getTitle());
        assertEquals("Devfolio", h.getPlatform());
        assertEquals("https://devfolio.co/logo.png", h.getLogo());
        assertEquals("https://ethindia2026.devfolio.co", h.getUrl());
        assertEquals("$20,000", h.getPrize());
        assertEquals(1500, h.getParticipants());
        assertEquals("In-Person", h.getMode());
        assertEquals("Open", h.getStatus());
        assertTrue(h.getFeatured());
        assertEquals("Devfolio Team", h.getOrganizer());
    }

    @Test
    void testFetchHackathons_slugFallbackAndDataHackathonsWrapper() {
        String mockJsonResponse = """
                {
                  "data": {
                    "hackathons": [
                      {
                        "slug": "web3-build",
                        "title": "Web3 Buildathon",
                        "cover_image_url": "https://devfolio.co/cover.png",
                        "is_online": true,
                        "status": "upcoming"
                      }
                    ]
                  }
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(
                ArgumentMatchers.anyString(),
                ArgumentMatchers.<HttpEntity<String>>any(),
                eq(String.class)
        )).thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();

        assertEquals(1, result.size());
        Hackathon h = result.get(0);
        assertEquals("devfolio-web3-build", h.getId());
        assertEquals("Web3 Buildathon", h.getTitle());
        assertEquals("https://devfolio.co/cover.png", h.getLogo());
        assertEquals("https://web3-build.devfolio.co", h.getUrl());
        assertEquals("Online", h.getMode());
        assertEquals("Upcoming", h.getStatus());
    }

    @Test
    void testFetchHackathons_emptyResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"data\": {\"hackathons\": []}}", HttpStatus.OK);
        when(restTemplate.postForEntity(ArgumentMatchers.anyString(), ArgumentMatchers.<HttpEntity<String>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_malformedResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("INVALID_JSON", HttpStatus.OK);
        when(restTemplate.postForEntity(ArgumentMatchers.anyString(), ArgumentMatchers.<HttpEntity<String>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_timeout() {
        when(restTemplate.postForEntity(ArgumentMatchers.anyString(), ArgumentMatchers.<HttpEntity<String>>any(), eq(String.class)))
                .thenThrow(new ResourceAccessException("Connect timeout"));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_http500() {
        when(restTemplate.postForEntity(ArgumentMatchers.anyString(), ArgumentMatchers.<HttpEntity<String>>any(), eq(String.class)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }
}
