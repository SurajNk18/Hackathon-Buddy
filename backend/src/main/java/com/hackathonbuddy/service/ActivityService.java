package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.response.ActivityResponse;
import com.hackathonbuddy.entity.User;
import java.util.List;

public interface ActivityService {
    List<ActivityResponse> getRecentActivity(User user);
    void logActivity(User user, String type, String message);
    void logActivity(User user, String type, String message, String referenceId, String referenceType);
}
