package com.hackathonbuddy.util;

import com.hackathonbuddy.model.Hackathon;

import java.util.*;

public class HackathonNormalizationUtils {

    public static List<Hackathon> deduplicate(List<Hackathon> hackathons) {
        if (hackathons == null || hackathons.isEmpty()) {
            return Collections.emptyList();
        }

        List<Hackathon> result = new ArrayList<>();
        Set<String> platformIdSet = new HashSet<>();
        Set<String> urlSet = new HashSet<>();
        Set<String> titleOrgSet = new HashSet<>();

        for (Hackathon h : hackathons) {
            if (h == null) continue;

            // 1. First priority: platform + external ID
            String platformIdKey = normalizeKey(h.getPlatform()) + "::" + normalizeKey(h.getId());
            if (h.getId() != null && !h.getId().trim().isEmpty() && platformIdSet.contains(platformIdKey)) {
                continue;
            }

            // 2. Second priority: normalized URL
            String normalizedUrl = normalizeUrl(h.getUrl());
            if (normalizedUrl != null && urlSet.contains(normalizedUrl)) {
                continue;
            }

            // 3. Third priority: normalized title + organizer
            String titleOrgKey = normalizeTitle(h.getTitle()) + "::" + normalizeTitle(h.getOrganizer());
            if (h.getTitle() != null && !h.getTitle().trim().isEmpty() && titleOrgSet.contains(titleOrgKey)) {
                continue;
            }

            // Add to tracking sets and result
            if (h.getId() != null && !h.getId().trim().isEmpty()) platformIdSet.add(platformIdKey);
            if (normalizedUrl != null) urlSet.add(normalizedUrl);
            if (h.getTitle() != null && !h.getTitle().trim().isEmpty()) titleOrgSet.add(titleOrgKey);

            result.add(h);
        }

        return result;
    }

    public static String normalizeUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return null;
        }
        String cleaned = url.trim().toLowerCase();
        cleaned = cleaned.replaceAll("^https?://", "");
        cleaned = cleaned.replaceAll("^www\\.", "");
        cleaned = cleaned.replaceAll("/+$", "");
        return cleaned.isEmpty() ? null : cleaned;
    }

    public static String normalizeTitle(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        return text.trim().toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    private static String normalizeKey(String val) {
        return val == null ? "" : val.trim().toLowerCase();
    }
}
