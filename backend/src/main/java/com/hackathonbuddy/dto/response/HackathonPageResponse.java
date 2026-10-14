package com.hackathonbuddy.dto.response;

import com.hackathonbuddy.model.Hackathon;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class HackathonPageResponse {
    private List<Hackathon> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private Map<String, ProviderMetaInfo> providers;

    public HackathonPageResponse() {
    }

    public HackathonPageResponse(List<Hackathon> content, int page, int size,
                                 long totalElements, int totalPages,
                                 Map<String, ProviderMetaInfo> providers) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.providers = providers;
    }
}
