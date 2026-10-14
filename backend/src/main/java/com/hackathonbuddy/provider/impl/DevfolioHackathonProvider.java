package com.hackathonbuddy.provider.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hackathonbuddy.model.Hackathon;
import com.hackathonbuddy.provider.HackathonProvider;
import com.hackathonbuddy.util.HtmlUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
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
public class DevfolioHackathonProvider implements HackathonProvider {

    private static final String DEVFOLIO_PRIMARY_URL = "https://api.devfolio.co/api/search/hackathons";
    private static final String DEVFOLIO_FALLBACK_URL = "https://devfolio.co/hackathons";
    private static final String USER_AGENT = "Mozilla/5.0 HackathonBuddy/1.0";
    private static final int TIMEOUT_MS = 8000;

    private final RestOperations restTemplate;
    private final ObjectMapper objectMapper;

    public DevfolioHackathonProvider() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(TIMEOUT_MS);
        requestFactory.setReadTimeout(TIMEOUT_MS);
        this.restTemplate = new RestTemplate(requestFactory);
        this.objectMapper = new ObjectMapper();
    }

    public DevfolioHackathonProvider(RestOperations restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "Devfolio";
    }

    @Override
    public List<Hackathon> fetchHackathons() {
        log.info("START: Fetching hackathons from Devfolio");
        List<Hackathon> result = fetchFromPrimaryEndpoint();
        if (!result.isEmpty()) {
            log.info("SUCCESS: Devfolio primary endpoint returned {} hackathons", result.size());
            return result;
        }

        log.warn("Devfolio primary endpoint returned no data, attempting GET fallback...");
        result = fetchFromFallbackEndpoint();
        if (!result.isEmpty()) {
            log.info("SUCCESS: Devfolio fallback endpoint returned {} hackathons", result.size());
            return result;
        }

        log.error("FAILURE: Both Devfolio primary and fallback endpoints failed or returned no data");
        return Collections.emptyList();
    }

    private List<Hackathon> fetchFromPrimaryEndpoint() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.set("User-Agent", USER_AGENT);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("query", "");
            requestBody.put("page", 1);
            requestBody.put("per_page", 24);

            ObjectNode filters = objectMapper.createObjectNode();
            var statusArray = filters.putArray("status");
            statusArray.add("open");
            statusArray.add("upcoming");
            requestBody.set("filters", filters);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    DEVFOLIO_PRIMARY_URL,
                    entity,
                    String.class
            );

            if (response.getBody() == null) {
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode hackathonsNode = extractHackathonsNode(root);

            if (hackathonsNode == null || !hackathonsNode.isArray()) {
                return Collections.emptyList();
            }

            List<Hackathon> list = new ArrayList<>();
            for (JsonNode h : hackathonsNode) {
                list.add(mapToHackathon(h));
            }
            return list;

        } catch (Exception e) {
            log.warn("Devfolio primary endpoint error: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<Hackathon> fetchFromFallbackEndpoint() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            headers.set("X-Requested-With", "XMLHttpRequest");
            headers.set("User-Agent", USER_AGENT);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    DEVFOLIO_FALLBACK_URL,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getBody() == null) {
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode hackathonsNode = extractHackathonsNode(root);

            if (hackathonsNode == null || !hackathonsNode.isArray()) {
                return Collections.emptyList();
            }

            List<Hackathon> list = new ArrayList<>();
            for (JsonNode h : hackathonsNode) {
                list.add(mapToHackathon(h));
            }
            return list;

        } catch (Exception e) {
            log.error("Devfolio fallback endpoint error: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private JsonNode extractHackathonsNode(JsonNode root) {
        if (root == null) return null;

        if (root.has("data")) {
            JsonNode dataNode = root.get("data");
            if (dataNode.isArray()) {
                return dataNode;
            } else if (dataNode.has("hackathons")) {
                return dataNode.get("hackathons");
            } else if (dataNode.has("results")) {
                return dataNode.get("results");
            } else if (dataNode.has("data")) {
                return dataNode.get("data");
            }
        }
        if (root.has("hackathons")) {
            return root.get("hackathons");
        }
        if (root.has("results")) {
            return root.get("results");
        }
        if (root.isArray()) {
            return root;
        }
        return null;
    }

    private Hackathon mapToHackathon(JsonNode h) {
        String rawId = getFirstText(h, "id");
        String slug = getFirstText(h, "slug");
        String id;
        if (rawId != null && !rawId.isEmpty()) {
            id = "devfolio-" + rawId;
        } else if (slug != null && !slug.isEmpty()) {
            id = "devfolio-" + slug;
        } else {
            id = null;
        }

        String title = getFirstText(h, "name", "title");
        if (title == null || title.trim().isEmpty()) {
            title = "Unnamed Hackathon";
        }

        String logo = getFirstText(h, "logo_url", "cover_image_url", "banner", "logo");

        String url;
        if (slug != null && !slug.trim().isEmpty()) {
            url = "https://" + slug.trim() + ".devfolio.co";
        } else {
            url = getFirstText(h, "url", "site_url");
            if (url == null || url.trim().isEmpty()) {
                url = "https://devfolio.co/hackathons";
            }
        }

        String deadline = getFirstText(h, "ends_at", "submission_deadline", "end_date", "submission_period_dates");

        String prizePool = getFirstText(h, "prize_pool");
        String prize;
        if (prizePool != null && !prizePool.trim().isEmpty()) {
            prize = prizePool.startsWith("₹") || prizePool.startsWith("$") ? prizePool.trim() : "₹" + prizePool.trim();
        } else {
            String rawPrize = getFirstText(h, "prize", "total_prize", "displayed_prize_amount", "prize_amount");
            prize = HtmlUtils.cleanPrize(rawPrize);
        }

        int participants = getFirstInt(h, "num_applications", "participants_count", "registrations_count", "participants");

        Boolean isOnline = getFirstBoolean(h, "is_online", "online_only");
        String mode;
        if (isOnline != null) {
            mode = isOnline ? "Online" : "In-Person";
        } else {
            String modeStr = getFirstText(h, "mode", "location");
            mode = (modeStr != null && modeStr.toLowerCase().contains("online")) ? "Online" : "In-Person";
        }

        List<String> tags = new ArrayList<>();
        JsonNode tagsNode = h.has("themes") ? h.get("themes") : (h.has("tracks") ? h.get("tracks") : h.get("tags"));
        if (tagsNode != null && tagsNode.isArray()) {
            for (JsonNode t : tagsNode) {
                String tagText = t.isObject() ? getFirstText(t, "name", "label", "title") : t.asText();
                if (tagText != null && !tagText.trim().isEmpty()) {
                    tags.add(tagText.trim());
                }
            }
        }

        String rawStatus = getFirstText(h, "status", "open_state");
        String status = ("open".equalsIgnoreCase(rawStatus) || "active".equalsIgnoreCase(rawStatus)) ? "Open" : "Upcoming";

        Boolean featured = getFirstBoolean(h, "is_featured", "featured");

        String organizer = null;
        if (h.has("organization")) {
            organizer = getFirstText(h.get("organization"), "name");
        }
        if (organizer == null && h.has("team")) {
            organizer = getFirstText(h.get("team"), "name");
        }
        if (organizer == null) {
            organizer = getFirstText(h, "organizer", "organization_name", "company_name");
        }

        return Hackathon.builder()
                .id(id)
                .title(title)
                .platform("Devfolio")
                .logo(logo)
                .url(url)
                .deadline(deadline)
                .prize(prize)
                .participants(participants)
                .mode(mode)
                .tags(tags)
                .status(status)
                .featured(featured != null ? featured : false)
                .organizer(organizer)
                .build();
    }

    private String getFirstText(JsonNode node, String... keys) {
        for (String key : keys) {
            if (node.has(key) && !node.get(key).isNull()) {
                String val = node.get(key).asText();
                if (val != null && !val.trim().isEmpty()) {
                    return val.trim();
                }
            }
        }
        return null;
    }

    private int getFirstInt(JsonNode node, String... keys) {
        for (String key : keys) {
            if (node.has(key) && !node.get(key).isNull()) {
                return node.get(key).asInt(0);
            }
        }
        return 0;
    }

    private Boolean getFirstBoolean(JsonNode node, String... keys) {
        for (String key : keys) {
            if (node.has(key) && !node.get(key).isNull()) {
                return node.get(key).asBoolean();
            }
        }
        return null;
    }
}
