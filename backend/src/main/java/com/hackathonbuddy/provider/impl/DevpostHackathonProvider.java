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
public class DevpostHackathonProvider implements HackathonProvider {

    private static final String DEVPOST_API_URL =
            "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&order_by=deadline&per_page=30";
    private static final String USER_AGENT = "Mozilla/5.0 HackathonBuddy/1.0";
    private static final int TIMEOUT_MS = 8000;

    private final RestOperations restTemplate;
    private final ObjectMapper objectMapper;

    public DevpostHackathonProvider() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(TIMEOUT_MS);
        requestFactory.setReadTimeout(TIMEOUT_MS);
        this.restTemplate = new RestTemplate(requestFactory);
        this.objectMapper = new ObjectMapper();
    }

    public DevpostHackathonProvider(RestOperations restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "Devpost";
    }

    @Override
    public List<Hackathon> fetchHackathons() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    DEVPOST_API_URL,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getBody() == null) {
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode hackathonsArray = root.path("hackathons");

            if (!hackathonsArray.isArray()) {
                return Collections.emptyList();
            }

            List<Hackathon> result = new ArrayList<>();
            for (JsonNode h : hackathonsArray) {
                result.add(mapToHackathon(h));
            }
            return result;

        } catch (Exception e) {
            log.error("Failed to fetch hackathons from Devpost: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private Hackathon mapToHackathon(JsonNode h) {
        String rawId = h.path("id").asText(null);
        String id = rawId != null ? "devpost-" + rawId : null;
        String title = h.path("title").asText(null);
        String url = h.path("url").asText(null);

        String logo = h.path("icon").asText(null);
        if (logo == null || logo.isEmpty()) {
            logo = h.path("thumbnail_url").asText(null);
        }

        String deadline = h.path("submission_period_dates").asText(null);

        // Prize mapping logic per STEP 4
        String displayedPrize = h.path("displayed_prize_amount").asText(null);
        String prize = HtmlUtils.cleanPrize(displayedPrize);
        if (prize == null) {
            double prizeAmount = h.path("prize_amount").asDouble(0);
            if (prizeAmount > 0) {
                long rounded = Math.round(prizeAmount);
                if (rounded == prizeAmount) {
                    prize = "$" + String.format("%,d", rounded);
                } else {
                    prize = "$" + String.format("%,.2f", prizeAmount);
                }
            }
        }

        int participants = h.path("registrations_count").asInt(0);
        boolean onlineOnly = h.path("online_only").asBoolean(false);
        String mode = onlineOnly ? "Online" : "In-Person / Hybrid";

        List<String> tags = new ArrayList<>();
        JsonNode themes = h.path("themes");
        if (themes.isArray()) {
            for (JsonNode theme : themes) {
                String name = theme.path("name").asText(null);
                if (name != null && !name.trim().isEmpty()) {
                    tags.add(name.trim());
                }
            }
        }

        String openState = h.path("open_state").asText("");
        String status = "open".equalsIgnoreCase(openState) ? "Open" : "Upcoming";

        boolean featured = h.path("featured").asBoolean(false);

        List<String> orgNames = new ArrayList<>();
        JsonNode orgs = h.path("organizations");
        if (orgs.isArray()) {
            for (JsonNode orgNode : orgs) {
                String name = orgNode.path("name").asText(null);
                if (name != null && !name.trim().isEmpty()) {
                    orgNames.add(name.trim());
                }
            }
        }
        String organizer = orgNames.isEmpty() ? null : String.join(", ", orgNames);

        return Hackathon.builder()
                .id(id)
                .title(title)
                .platform("Devpost")
                .logo(logo)
                .url(url)
                .deadline(deadline)
                .prize(prize)
                .participants(participants)
                .mode(mode)
                .tags(tags)
                .status(status)
                .featured(featured)
                .organizer(organizer)
                .build();
    }
}
