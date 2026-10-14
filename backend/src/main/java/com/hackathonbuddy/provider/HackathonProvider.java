package com.hackathonbuddy.provider;

import com.hackathonbuddy.model.Hackathon;
import java.util.List;

public interface HackathonProvider {
    String getProviderName();
    List<Hackathon> fetchHackathons();
}
