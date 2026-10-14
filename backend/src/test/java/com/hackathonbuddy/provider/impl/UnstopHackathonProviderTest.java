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

class UnstopHackathonProviderTest {

    private RestOperations restTemplate;
    private UnstopHackathonProvider provider;

    @BeforeEach
    void setUp() {
        restTemplate = Mockito.mock(RestOperations.class);
        provider = new UnstopHackathonProvider(restTemplate);
    }

    @Test
    void testGetProviderName() {
        assertEquals("Unstop", provider.getProviderName());
    }

    @Test
    void testFetchHackathons_successfulResponse() {
        String mockJsonResponse = """
                {
                  "data": {
                    "data": [
                      {
                        "id": 9876,
                        "title": "Unstop Tech Challenge",
                        "logo": "https://unstop.com/logo.png",
                        "public_url": "hackathons/unstop-tech-challenge",
                        "end_date": "2026-12-10",
                        "prizes_text": "₹50,000",
                        "total_registered": 1200,
                        "hackathon_setting": "Online",
                        "is_featured": true,
                        "tags": [
                          { "name": "Coding" }
                        ],
                        "organisation": {
                          "name": "Unstop India"
                        }
                      }
                    ]
                  }
                }
                """;

        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockJsonResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1&size=20&oppstatus=open"),
                eq(HttpMethod.GET),
                ArgumentMatchers.<HttpEntity<Void>>any(),
                eq(String.class)
        )).thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();

        assertNotNull(result);
        assertEquals(1, result.size());

        Hackathon h = result.get(0);
        assertEquals("unstop-9876", h.getId());
        assertEquals("Unstop Tech Challenge", h.getTitle());
        assertEquals("Unstop", h.getPlatform());
        assertEquals("https://unstop.com/logo.png", h.getLogo());
        assertEquals("https://unstop.com/hackathons/unstop-tech-challenge", h.getUrl());
        assertEquals("2026-12-10", h.getDeadline());
        assertEquals("₹50,000", h.getPrize());
        assertEquals(1200, h.getParticipants());
        assertEquals("Online", h.getMode());
        assertEquals("Open", h.getStatus());
        assertTrue(h.getFeatured());
        assertEquals("Unstop India", h.getOrganizer());
    }

    @Test
    void testFetchHackathons_emptyResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"data\": {\"data\": []}}", HttpStatus.OK);
        when(restTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.GET), ArgumentMatchers.<HttpEntity<Void>>any(), eq(String.class)))
                .thenReturn(responseEntity);

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }

    @Test
    void testFetchHackathons_malformedResponse() {
        ResponseEntity<String> responseEntity = new ResponseEntity<>("INVALID_JSON", HttpStatus.OK);
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
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Server Error"));

        List<Hackathon> result = provider.fetchHackathons();
        assertTrue(result.isEmpty());
    }
}
