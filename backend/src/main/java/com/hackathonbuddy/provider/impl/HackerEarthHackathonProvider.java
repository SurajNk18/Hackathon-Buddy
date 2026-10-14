package com.hackathonbuddy.provider.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathonbuddy.model.Hackathon;
import com.hackathonbuddy.provider.HackathonProvider;
import com.hackathonbuddy.util.HtmlUtils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class HackerEarthHackathonProvider implements HackathonProvider {

    private static final String HACKEREARTH_API_URL = "https://www.hackerearth.com/chrome-extension/events/";
    private static final String USER_AGENT = "Mozilla/5.0 HackathonBuddy/1.0";
    private static final int TIMEOUT_MS = 8000;

    private final RestOperations restTemplate;
    private final ObjectMapper objectMapper;

    public HackerEarthHackathonProvider() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(TIMEOUT_MS);
        requestFactory.setReadTimeout(TIMEOUT_MS);
        this.restTemplate = new RestTemplate(requestFactory);
        this.objectMapper = new ObjectMapper();
    }

    public HackerEarthHackathonProvider(RestOperations restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "HackerEarth";
    }

    @Override
    public List<Hackathon> fetchHackathons() {
        log.info("START: Fetching hackathons from HackerEarth");
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    HACKEREARTH_API_URL,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getBody() == null) {
                log.info("SUCCESS: HackerEarth returned 0 hackathons (null body)");
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode eventsArray = root.path("response");

            if (!eventsArray.isArray()) {
                if (root.isArray()) {
                    eventsArray = root;
                } else {
                    log.info("SUCCESS: HackerEarth returned 0 hackathons");
                    return Collections.emptyList();
                }
            }

            List<Hackathon> result = new ArrayList<>();
            for (JsonNode h : eventsArray) {
                result.add(mapToHackathon(h));
            }
            log.info("SUCCESS: HackerEarth returned {} hackathons", result.size());
            return result;

        } catch (Exception e) {
            log.error("FAILURE: HackerEarth fetch failed: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private Hackathon mapToHackathon(JsonNode h) {
        String title = h.path("title").asText(null);
        String url = h.path("url").asText(null);

        // Derive deterministic ID from URL slug or title
        String slug = extractSlugFromUrl(url);
        if (slug == null && title != null) {
            slug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
        String id = "hackerearth-" + (slug != null ? slug : "unknown");

        String logo = h.path("thumbnail").asText(null);

        String deadline = h.path("end_utc_tz").asText(null);
        if (deadline == null || deadline.isEmpty()) {
            deadline = h.path("end_date").asText(null);
        }

        String rawPrize = h.path("prize").asText(null);
        String prize = HtmlUtils.cleanPrize(rawPrize);

        int participants = h.path("num_registrations").asInt(0);

        List<String> tags = new ArrayList<>();
        String challengeType = h.path("challenge_type").asText(null);
        if (challengeType != null && !challengeType.trim().isEmpty()) {
            tags.add(challengeType.trim());
        }

        String rawStatus = h.path("status").asText("");
        String status = "ONGOING".equalsIgnoreCase(rawStatus) || "open".equalsIgnoreCase(rawStatus) ? "Open" : "Upcoming";

        boolean isHackerEarth = h.path("is_hackerearth").asBoolean(false);
        String organizer = isHackerEarth ? "HackerEarth" : h.path("company_name").asText(null);

        return Hackathon.builder()
                .id(id)
                .title(title != null ? title : "Unnamed Hackathon")
                .platform("HackerEarth")
                .logo(logo)
                .url(url)
                .deadline(deadline)
                .prize(prize)
                .participants(participants)
                .mode("Online")
                .tags(tags)
                .status(status)
                .featured(false)
                .organizer(organizer)
                .build();
    }

    private String extractSlugFromUrl(String url) {
        if (url == null || url.trim().isEmpty()) return null;
        String clean = url.trim().replaceAll("/+$", "");
        int lastSlash = clean.lastIndexOf('/');
        if (lastSlash >= 0 && lastSlash < clean.length() - 1) {
            return clean.substring(lastSlash + 1);
        }
        return null;
    }
}
