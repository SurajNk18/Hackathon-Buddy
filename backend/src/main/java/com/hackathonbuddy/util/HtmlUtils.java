package com.hackathonbuddy.util;

import java.util.regex.Pattern;

public class HtmlUtils {

    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");
    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s+");
    private static final Pattern LEADING_MULTIPLE_DOLLARS_PATTERN = Pattern.compile("^\\$+\\s*");

    /**
     * Cleans an HTML string by removing tags, decoding entities, normalizing whitespace, and trimming.
     * @param input Raw HTML string
     * @return Cleaned plain text, or null if input is null/empty after cleaning
     */
    public static String cleanHtml(String input) {
        if (input == null) {
            return null;
        }

        // 1. Remove HTML tags
        String text = HTML_TAG_PATTERN.matcher(input).replaceAll("");

        // 2. Decode common HTML entities using Spring's HtmlUtils
        text = org.springframework.web.util.HtmlUtils.htmlUnescape(text);

        // 3. Normalize whitespace
        text = WHITESPACE_PATTERN.matcher(text).replaceAll(" ");

        // 4. Trim
        text = text.trim();

        return text.isEmpty() ? null : text;
    }

    /**
     * Cleans and normalizes prize strings, handling HTML, duplicate '$' signs,
     * and filtering out meaningless prize values like "$0", "$$0", "$0.00", etc.
     * @param prizeInput Raw prize string (could contain HTML)
     * @return Cleaned prize string or null if meaningless/empty
     */
    public static String cleanPrize(String prizeInput) {
        String cleaned = cleanHtml(prizeInput);
        if (cleaned == null) {
            return null;
        }

        // Handle cases like "$$2,500" -> "$2,500"
        if (cleaned.startsWith("$")) {
            cleaned = LEADING_MULTIPLE_DOLLARS_PATTERN.matcher(cleaned).replaceFirst("\\$");
        }

        // Check for meaningless prize values such as "$0", "$$0", "0", "$0.00", etc.
        String numericOnly = cleaned.replaceAll("[\\$\\s,]", "");
        if (numericOnly.isEmpty() || isZeroAmount(numericOnly)) {
            return null;
        }

        return cleaned;
    }

    private static boolean isZeroAmount(String text) {
        try {
            double value = Double.parseDouble(text);
            return value == 0.0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
