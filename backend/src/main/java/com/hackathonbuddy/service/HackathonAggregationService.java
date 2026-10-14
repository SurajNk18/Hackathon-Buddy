package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.response.HackathonPageResponse;
import com.hackathonbuddy.dto.response.ProviderMetaInfo;
import com.hackathonbuddy.model.Hackathon;
import com.hackathonbuddy.provider.HackathonProvider;
import com.hackathonbuddy.util.HackathonNormalizationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HackathonAggregationService {

    private static final long CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    private final List<HackathonProvider> providers;

    private static class CacheEntry {
        final HackathonPageResponse data;
        final long timestamp;

        CacheEntry(HackathonPageResponse data, long timestamp) {
            
            this.data = data;
            this.timestamp = timestamp;
        }
    }

    public HackathonPageResponse fetchAndAggregate(
            List<String> platformFilters,
            String statusFilter,
            String searchFilter,
            String modeFilter,
            Boolean featuredFilter,
            String sortBy,
            String direction,
            int page,
            int size) {

        String cacheKey = buildCacheKey(platformFilters, statusFilter, searchFilter, modeFilter, featuredFilter, sortBy, direction, page, size);
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && (System.currentTimeMillis() - cached.timestamp) < CACHE_TTL_MS) {
            log.info("Returning cached hackathon aggregation results for key: {}", cacheKey);
            return cached.data;
        }

        List<Hackathon> aggregatedList = new ArrayList<>();
        Map<String, ProviderMetaInfo> providerMetaMap = new LinkedHashMap<>();

        // Normalize platform filter strings for case-insensitive matching
        Set<String> targetPlatforms = (platformFilters != null && !platformFilters.isEmpty())
                ? platformFilters.stream()
                        .flatMap(p -> Arrays.stream(p.split(",")))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toSet())
                : Collections.emptySet();

        for (HackathonProvider provider : providers) {
            String providerName = provider.getProviderName();
            String key = providerName.toLowerCase();

            // Skip provider if platform filter is specified and doesn't match
            if (!targetPlatforms.isEmpty() && !targetPlatforms.contains(key)) {
                continue;
            }

            try {
                log.info("START: Fetching hackathons from {}", providerName);
                List<Hackathon> fetched = provider.fetchHackathons();
                if (fetched == null) fetched = Collections.emptyList();

                aggregatedList.addAll(fetched);
                providerMetaMap.put(key, ProviderMetaInfo.builder()
                        .success(true)
                        .count(fetched.size())
                        .build());
                log.info("SUCCESS: Provider {} returned {} hackathons", providerName, fetched.size());

            } catch (Exception e) {
                log.error("FAILURE: Provider {} failed: {}", providerName, e.getMessage());
                providerMetaMap.put(key, ProviderMetaInfo.builder()
                        .success(false)
                        .count(0)
                        .error(e.getMessage())
                        .build());
            }
        }

        // STEP 17: Deduplication
        List<Hackathon> deduplicated = HackathonNormalizationUtils.deduplicate(aggregatedList);

        // STEP 13: Filtering
        List<Hackathon> filtered = filterHackathons(deduplicated, statusFilter, searchFilter, modeFilter, featuredFilter);

        // STEP 14: Sorting
        sortHackathons(filtered, sortBy, direction);

        // STEP 15: Pagination
        int totalElements = filtered.size();
        int safeSize = size <= 0 ? 20 : size;
        int safePage = Math.max(0, page);
        int totalPages = (int) Math.ceil((double) totalElements / safeSize);

        int fromIndex = safePage * safeSize;
        List<Hackathon> pagedContent;
        if (fromIndex >= totalElements) {
            pagedContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(fromIndex + safeSize, totalElements);
            pagedContent = new ArrayList<>(filtered.subList(fromIndex, toIndex));
        }

        HackathonPageResponse response = HackathonPageResponse.builder()
                .content(pagedContent)
                .page(safePage)
                .size(safeSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .providers(providerMetaMap)
                .build();

        cache.put(cacheKey, new CacheEntry(response, System.currentTimeMillis()));
        return response;
    }

    public Optional<Hackathon> findById(String id) {
        if (id == null || id.trim().isEmpty()) {
            return Optional.empty();
        }
        HackathonPageResponse response = fetchAndAggregate(null, null, null, null, null, null, null, 0, 500);
        return response.getContent().stream()
                .filter(h -> id.equalsIgnoreCase(h.getId()))
                .findFirst();
    }

    public void clearCache() {
        cache.clear();
    }

    private String buildCacheKey(List<String> platforms, String status, String search, String mode, Boolean featured, String sortBy, String direction, int page, int size) {
        return String.format("p=%s|s=%s|q=%s|m=%s|f=%s|sb=%s|d=%s|pg=%d|sz=%d",
                platforms != null ? String.join(",", platforms) : "",
                status, search, mode, featured, sortBy, direction, page, size);
    }

    private List<Hackathon> filterHackathons(
            List<Hackathon> list,
            String statusFilter,
            String searchFilter,
            String modeFilter,
            Boolean featuredFilter) {

        return list.stream().filter(h -> {
            // Status filter
            if (statusFilter != null && !statusFilter.trim().isEmpty()) {
                if (h.getStatus() == null || !h.getStatus().equalsIgnoreCase(statusFilter.trim())) {
                    return false;
                }
            }

            // Mode filter
            if (modeFilter != null && !modeFilter.trim().isEmpty()) {
                if (h.getMode() == null || !h.getMode().toLowerCase().contains(modeFilter.trim().toLowerCase())) {
                    return false;
                }
            }

            // Featured filter
            if (featuredFilter != null) {
                if (!Objects.equals(h.getFeatured(), featuredFilter)) {
                    return false;
                }
            }

            // Search filter: case-insensitive match on title, organizer, or tags
            if (searchFilter != null && !searchFilter.trim().isEmpty()) {
                String searchLower = searchFilter.trim().toLowerCase();
                boolean titleMatches = h.getTitle() != null && h.getTitle().toLowerCase().contains(searchLower);
                boolean orgMatches = h.getOrganizer() != null && h.getOrganizer().toLowerCase().contains(searchLower);
                boolean tagMatches = h.getTags() != null && h.getTags().stream()
                        .anyMatch(t -> t != null && t.toLowerCase().contains(searchLower));

                if (!titleMatches && !orgMatches && !tagMatches) {
                    return false;
                }
            }

            return true;
        }).collect(Collectors.toList());
    }

    private void sortHackathons(List<Hackathon> list, String sortBy, String direction) {
        boolean isDesc = "desc".equalsIgnoreCase(direction);
        String field = (sortBy == null || sortBy.trim().isEmpty()) ? "deadline" : sortBy.trim().toLowerCase();

        Comparator<Hackathon> comparator;

        switch (field) {
            case "title":
                comparator = Comparator.comparing(
                        h -> h.getTitle() == null ? "" : h.getTitle().toLowerCase(),
                        Comparator.naturalOrder());
                break;
            case "platform":
                comparator = Comparator.comparing(
                        h -> h.getPlatform() == null ? "" : h.getPlatform().toLowerCase(),
                        Comparator.naturalOrder());
                break;
            case "deadline":
            default:
                // Records with known deadline appear before null deadlines
                comparator = (h1, h2) -> {
                    if (h1.getDeadline() == null && h2.getDeadline() == null) return 0;
                    if (h1.getDeadline() == null) return 1;
                    if (h2.getDeadline() == null) return -1;
                    return h1.getDeadline().compareToIgnoreCase(h2.getDeadline());
                };
                break;
        }

        if (isDesc) {
            comparator = comparator.reversed();
        }

        list.sort(comparator);
    }
}
