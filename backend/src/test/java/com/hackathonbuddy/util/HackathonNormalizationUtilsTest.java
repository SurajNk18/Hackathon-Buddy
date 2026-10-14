package com.hackathonbuddy.util;

import com.hackathonbuddy.model.Hackathon;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class HackathonNormalizationUtilsTest {

    @Test
    void testNormalizeUrl() {
        assertEquals("devpost.com/hackathons/1", HackathonNormalizationUtils.normalizeUrl("https://www.devpost.com/hackathons/1/"));
        assertEquals("devfolio.co/hack1", HackathonNormalizationUtils.normalizeUrl("http://devfolio.co/hack1"));
        assertNull(HackathonNormalizationUtils.normalizeUrl(null));
        assertNull(HackathonNormalizationUtils.normalizeUrl(""));
    }

    @Test
    void testNormalizeTitle() {
        assertEquals("aiinnovationsprint2026", HackathonNormalizationUtils.normalizeTitle("AI Innovation Sprint 2026!"));
        assertEquals("", HackathonNormalizationUtils.normalizeTitle(null));
    }

    @Test
    void testDeduplicate_byIdUrlAndTitleOrg() {
        Hackathon h1 = Hackathon.builder()
                .id("devpost-101")
                .title("AI Sprint")
                .platform("Devpost")
                .url("https://devpost.com/ai-sprint")
                .organizer("Org A")
                .build();

        // Duplicate by ID
        Hackathon h2 = Hackathon.builder()
                .id("devpost-101")
                .title("AI Sprint Duplicate")
                .platform("Devpost")
                .url("https://devpost.com/ai-sprint-2")
                .organizer("Org A")
                .build();

        // Duplicate by normalized URL
        Hackathon h3 = Hackathon.builder()
                .id("devpost-102")
                .title("AI Sprint Different ID")
                .platform("Devpost")
                .url("http://www.devpost.com/ai-sprint/")
                .organizer("Org A")
                .build();

        // Duplicate by title + organizer
        Hackathon h4 = Hackathon.builder()
                .id("devfolio-201")
                .title("AI Sprint")
                .platform("Devfolio")
                .url("https://devfolio.co/ai-sprint-other")
                .organizer("Org A")
                .build();

        // Unique hackathon
        Hackathon h5 = Hackathon.builder()
                .id("unstop-301")
                .title("Web3 Hackathon")
                .platform("Unstop")
                .url("https://unstop.com/web3")
                .organizer("Org B")
                .build();

        List<Hackathon> list = List.of(h1, h2, h3, h4, h5);
        List<Hackathon> result = HackathonNormalizationUtils.deduplicate(list);

        assertEquals(2, result.size());
        assertEquals("devpost-101", result.get(0).getId());
        assertEquals("unstop-301", result.get(1).getId());
    }
}
