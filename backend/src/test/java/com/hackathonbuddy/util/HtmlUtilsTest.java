package com.hackathonbuddy.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class HtmlUtilsTest {

    @Test
    void testCleanHtml_basicTagsAndEntities() {
        String input = "<div>Hello &amp; <b>World</b></div>";
        String cleaned = HtmlUtils.cleanHtml(input);
        assertEquals("Hello & World", cleaned);
    }

    @Test
    void testCleanHtml_whitespaceNormalization() {
        String input = "  Hello   \n\t World  ";
        String cleaned = HtmlUtils.cleanHtml(input);
        assertEquals("Hello World", cleaned);
    }

    @Test
    void testCleanHtml_nullAndEmpty() {
        assertNull(HtmlUtils.cleanHtml(null));
        assertNull(HtmlUtils.cleanHtml(""));
        assertNull(HtmlUtils.cleanHtml("   "));
        assertNull(HtmlUtils.cleanHtml("<div></div>"));
    }

    @Test
    void testCleanPrize_devpostHtmlExample() {
        String input = "$$<span data-currency-value>2,500</span>";
        String cleaned = HtmlUtils.cleanPrize(input);
        assertEquals("$2,500", cleaned);
    }

    @Test
    void testCleanPrize_meaninglessPrizes() {
        assertNull(HtmlUtils.cleanPrize("$0"));
        assertNull(HtmlUtils.cleanPrize("$$0"));
        assertNull(HtmlUtils.cleanPrize("0"));
        assertNull(HtmlUtils.cleanPrize("$0.00"));
        assertNull(HtmlUtils.cleanPrize("$$0.00"));
        assertNull(HtmlUtils.cleanPrize(""));
        assertNull(HtmlUtils.cleanPrize(null));
    }

    @Test
    void testCleanPrize_validPrizeStrings() {
        assertEquals("$10,000", HtmlUtils.cleanPrize("$10,000"));
        assertEquals("$500", HtmlUtils.cleanPrize("  $$500  "));
        assertEquals("1000 EUR", HtmlUtils.cleanPrize("1000 EUR"));
    }
}
