package com.hackathonbuddy.service;

import com.hackathonbuddy.dto.response.DashboardStatsResponse;
import com.hackathonbuddy.entity.User;

public interface DashboardService {
    DashboardStatsResponse getDashboardStats(User user);
}
