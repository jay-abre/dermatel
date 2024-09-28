// SignalingHandler.java
package com.example.dermatel.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

public class SignalingHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new HashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Map<String, String> data = parsePayload(payload);

        switch (data.get("type")) {
            case "join":
                sessions.put(data.get("userId"), session);
                break;
            case "signal":
                WebSocketSession targetSession = sessions.get(data.get("to"));
                if (targetSession != null) {
                    targetSession.sendMessage(new TextMessage(payload));
                }
                break;
            case "leave":
                sessions.remove(data.get("userId"));
                break;
        }
    }

    private Map<String, String> parsePayload(String payload) throws Exception {
        return objectMapper.readValue(payload, Map.class);
    }
}