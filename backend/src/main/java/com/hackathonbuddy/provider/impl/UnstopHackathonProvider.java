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
public class UnstopHackathonProvider implements HackathonProvider {

    private static final String UNSTOP_API_URL =
            "https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1&size=20&oppstatus=open";
    private static final String USER_AGENT = "Mozilla/5.0 HackathonBuddy/1.0";
    private static final int TIMEOUT_MS = 8000;

    private final RestOperations restTemplate;
    private final ObjectMapper objectMapper;

    public UnstopHackathonProvider() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(TIMEOUT_MS);
        requestFactory.setReadTimeout(TIMEOUT_MS);
        this.restTemplate = new RestTemplate(requestFactory);
        this.objectMapper = new ObjectMapper();
    }

    public UnstopHackathonProvider(RestOperations restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "Unstop";
    }

    @Override
    public List<Hackathon> fetchHackathons() {
        log.info("START: Fetching hackathons from Unstop");
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            headers.set("Accept", "application/json");
            headers.set("Referer", "https://unstop.com/hackathons");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    UNSTOP_API_URL,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getBody() == null) {
                log.info("SUCCESS: Unstop returned 0 hackathons (null body)");
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode itemsArray = extractItemsArray(root);

            if (itemsArray == null || !itemsArray.isArray()) {
                log.info("SUCCESS: Unstop returned 0 hackathons");
                return Collections.emptyList();
            }

            List<Hackathon> result = new ArrayList<>();
            for (JsonNode h : itemsArray) {
                result.add(mapToHackathon(h));
            }
            log.info("SUCCESS: Unstop returned {} hackathons", result.size());
            return result;

        } catch (Exception e) {
            log.error("FAILURE: Unstop fetch failed: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private JsonNode extractItemsArray(JsonNode root) {
        if (root == null) return null;
        if (root.has("data")) {
            JsonNode data = root.get("data");
            if (data.isArray()) {
                return data;
            } else if (data.has("data") && data.get("data").isArray()) {
                return data.get("data");
            } else if (data.has("results") && data.get("results").isArray()) {
                return data.get("results");
            }
        }
        if (root.isArray()) {
            return root;
        }
        return null;
    }

    private Hackathon mapToHackathon(JsonNode h) {
        String rawId = h.path("id").asText(null);
        String id = rawId != null ? "unstop-" + rawId : null;

        String title = h.path("title").asText("Unnamed Hackathon");

        String logo = h.path("logo").asText(null);
        if (logo == null || logo.isEmpty()) {
            logo = h.path("image").asText(null);
        }

        String publicUrl = h.path("public_url").asText(null);
        String url;
        if (publicUrl != null && !publicUrl.trim().isEmpty()) {
            url = publicUrl.startsWith("http") ? publicUrl : "https://unstop.com/" + publicUrl;
        } else {
            url = "https://unstop.com/hackathons";
        }

        String deadline = h.path("end_date").asText(null);
        if (deadline == null || deadline.isEmpty()) {
            deadline = h.path("reg_end_date").asText(null);
        }

        String prizesText = h.path("prizes_text").asText(null);
        String prize = HtmlUtils.cleanPrize(prizesText);
        if (prize == null) {
            String rawPrize = h.path("prize").asText(null);
            if (rawPrize != null && !rawPrize.trim().isEmpty()) {
                prize = rawPrize.startsWith("₹") || rawPrize.startsWith("$") ? rawPrize.trim() : "₹" + rawPrize.trim();
            }
        }

        int participants = h.path("total_registered").asInt(0);

        String setting = h.path("hackathon_setting").asText(null);
        String mode = (setting != null && !setting.trim().isEmpty()) ? setting.trim() : "Online";

        List<String> tags = new ArrayList<>();
        JsonNode tagsNode = h.path("tags");
        if (tagsNode.isArray()) {
            for (JsonNode tag : tagsNode) {
                String name = tag.isObject() ? tag.path("name").asText(null) : tag.asText(null);
                if (name != null && !name.trim().isEmpty()) {
                    tags.add(name.trim());
                }
            }
        }

        boolean featured = h.path("is_featured").asBoolean(false);

        String organizer = null;
        if (h.has("organisation")) {
            organizer = h.path("organisation").path("name").asText(null);
        } else if (h.has("organizer")) {
            organizer = h.path("organizer").asText(null);
        }

        return Hackathon.builder()
                .id(id)
                .title(title)
                .platform("Unstop")
                .logo(logo)
                .url(url)
                .deadline(deadline)
                .prize(prize)
                .participants(participants)
                .mode(mode)
                .tags(tags)
                .status("Open")
                .featured(featured)
                .organizer(organizer)
                .build();
    }
}
