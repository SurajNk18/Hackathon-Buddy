package com.hackathonbuddy.client;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiServiceClientTest {

    @Mock
    private RestTemplate restTemplate;

    private AiServiceClient aiServiceClient;

    @BeforeEach
    void setUp() {
        aiServiceClient = new AiServiceClient(restTemplate);
        ReflectionTestUtils.setField(aiServiceClient, "aiServiceUrl", "http://localhost:8000");
    }

    @Test
    void testAskChatbot_PythonServiceSuccess() {
        Map<String, Object> responseBody = Map.of("response", "Here is an innovative AI hackathon architecture plan!");
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);

        when(restTemplate.postForEntity(eq("http://localhost:8000/api/ml/chat"), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        String result = aiServiceClient.askChatbot(
                "How do I architect my project?",
                "Alex (Full-stack developer)",
                List.of("React", "Spring Boot"),
                List.of()
        );

        assertNotNull(result);
        assertEquals("Here is an innovative AI hackathon architecture plan!", result);
    }

    @Test
    void testAskChatbot_FallbackToDomainEngineWhenServiceDown() {
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class)))
                .thenThrow(new RestClientException("Connection refused"));

        String result = aiServiceClient.askChatbot(
                "Suggest an idea for the hackathon",
                "Sam (AI Specialist)",
                List.of("Python", "TensorFlow"),
                List.of()
        );

        assertNotNull(result);
        assertFalse(result.isBlank());
        // Verify domain fallback returns rich advice
        assertTrue(result.contains("AI") || result.contains("Hackathon") || result.contains("Project Idea") || result.contains("Architecture"));
    }

    @Test
    void testAskChatbot_PitchAdvice() {
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class)))
                .thenThrow(new RestClientException("Connection refused"));

        String result = aiServiceClient.askChatbot(
                "How should we structure our 3-minute demo pitch?",
                "User",
                List.of(),
                List.of()
        );

        assertNotNull(result);
        assertTrue(result.contains("Pitch") || result.contains("Demo") || result.contains("Problem") || result.contains("Hackathon"));
    }
}
