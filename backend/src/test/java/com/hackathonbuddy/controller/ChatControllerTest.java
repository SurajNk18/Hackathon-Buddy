package com.hackathonbuddy.controller;

import com.hackathonbuddy.client.AiServiceClient;
import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.entity.ChatMessage;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ChatControllerTest {

    private ChatMessageRepository chatMessageRepository;
    private TeamRepository teamRepository;
    private TeamMemberRepository teamMemberRepository;
    private UserRepository userRepository;
    private UserSkillRepository userSkillRepository;
    private AiServiceClient aiServiceClient;
    private SimpMessagingTemplate messagingTemplate;

    private ChatController chatController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        chatMessageRepository = mock(ChatMessageRepository.class);
        teamRepository = mock(TeamRepository.class);
        teamMemberRepository = mock(TeamMemberRepository.class);
        userRepository = mock(UserRepository.class);
        userSkillRepository = mock(UserSkillRepository.class);
        aiServiceClient = mock(AiServiceClient.class);
        messagingTemplate = mock(SimpMessagingTemplate.class);

        chatController = new ChatController(
                chatMessageRepository,
                teamRepository,
                teamMemberRepository,
                userRepository,
                userSkillRepository,
                aiServiceClient,
                messagingTemplate
        );

        testUser = User.builder()
                .id(10L)
                .email("test@example.com")
                .firstName("Sanika")
                .lastName("Patil")
                .primaryRole("Full Stack Developer")
                .build();

        userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    void testAskAssistant_Success() {
        when(aiServiceClient.askChatbot(anyString(), anyString(), anyList(), anyList()))
                .thenReturn("Here is a winning AI hackathon concept: Smart Urban Mobility");

        when(chatMessageRepository.save(any(ChatMessage.class)))
                .thenAnswer(invocation -> {
                    ChatMessage msg = invocation.getArgument(0);
                    msg.setId(99L);
                    return msg;
                });

        Map<String, String> body = Map.of("message", "Suggest a project idea for AI hackathon");
        ResponseEntity<ApiResponse<ChatMessage>> response = chatController.askAssistant(body, userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());

        ChatMessage aiMessage = response.getBody().getData();
        assertNotNull(aiMessage);
        assertEquals("AI", aiMessage.getMessageType());
        assertEquals(10L, aiMessage.getConversationId());
        assertEquals(10L, aiMessage.getTeamId());
        assertTrue(aiMessage.getContent().contains("Smart Urban Mobility"));

        // Verify user query was saved and AI response was saved
        verify(chatMessageRepository, times(2)).save(any(ChatMessage.class));
    }

    @Test
    void testAskAssistant_EmptyMessage() {
        Map<String, String> body = Map.of("message", "   ");
        ResponseEntity<ApiResponse<ChatMessage>> response = chatController.askAssistant(body, userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Query message cannot be empty", response.getBody().getMessage());

        verify(aiServiceClient, never()).askChatbot(any(), any(), any(), any());
    }

    @Test
    void testAskAssistant_Unauthorized() {
        Map<String, String> body = Map.of("message", "Hello AI");
        ResponseEntity<ApiResponse<ChatMessage>> response = chatController.askAssistant(body, null);

        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void testGetAssistantMessages_ReturnsHistory() {
        ChatMessage m1 = ChatMessage.builder()
                .id(1L)
                .conversationId(10L)
                .senderId(10L)
                .content("Hello")
                .messageType("USER")
                .timestamp(LocalDateTime.now().minusMinutes(5))
                .build();

        ChatMessage m2 = ChatMessage.builder()
                .id(2L)
                .conversationId(10L)
                .senderId(0L)
                .content("Hello! How can I help?")
                .messageType("AI")
                .timestamp(LocalDateTime.now())
                .build();

        when(chatMessageRepository.findByConversationIdAndTeamIdIsNullOrderByTimestampAsc(10L))
                .thenReturn(List.of(m1, m2));

        ResponseEntity<ApiResponse<List<ChatMessage>>> response = chatController.getAssistantMessages(userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals(2, response.getBody().getData().size());
    }

    @Test
    void testClearAssistantHistory() {
        ResponseEntity<ApiResponse<String>> response = chatController.clearAssistantHistory(userDetails);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        verify(chatMessageRepository, times(1)).deleteByConversationIdAndTeamIdIsNull(10L);
    }
}
