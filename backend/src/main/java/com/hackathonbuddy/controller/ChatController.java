package com.hackathonbuddy.controller;

import com.hackathonbuddy.dto.response.ApiResponse;
import com.hackathonbuddy.entity.ChatMessage;
import com.hackathonbuddy.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;

    /**
     * WebSocket endpoint: client sends to /app/chat/{conversationId}
     * Server broadcasts to /topic/chat/{conversationId}
     */
    @MessageMapping("/chat/{conversationId}")
    @SendTo("/topic/chat/{conversationId}")
    public ChatMessage sendMessage(
            @DestinationVariable Long conversationId,
            @Payload ChatMessage message) {
        message.setConversationId(conversationId);
        return chatMessageRepository.save(message);
    }

    /**
     * REST endpoint to fetch message history for a conversation
     */
    @GetMapping("/api/chat/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getMessages(
            @PathVariable Long conversationId) {
        List<ChatMessage> messages = chatMessageRepository
                .findByConversationIdOrderByTimestampAsc(conversationId);
        return ResponseEntity.ok(ApiResponse.<List<ChatMessage>>builder()
                .success(true).message("Messages retrieved").data(messages).build());
    }
}
