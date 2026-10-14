package com.hackathonbuddy.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProviderMetaInfo {
    private boolean success;
    private int count;
    private String error;

    public ProviderMetaInfo() {
    }

    public ProviderMetaInfo(boolean success, int count, String error) {
        this.success = success;
        this.count = count;
        this.error = error;
    }
}
