package nathanthomp.euchre.server;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import nathanthomp.euchre.server.game.GameRegistry;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<WebSocketSession>());

    private final Map<String, Set<WebSocketSession>> sessionsByGame = new ConcurrentHashMap<>();

    @Autowired
    private GameRegistry gameRegistry;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Assign a unique ID to the session
        String sessionId = UUID.randomUUID().toString();
        System.out.println("session.getId(): " + session.getId());
        session.getAttributes().put("sessionId", sessionId);
        System.out.println("New WebSocket connection established with session ID: " + sessionId);
        session.sendMessage(new TextMessage(
                "New WebSocket connection established with session ID: " + session.getAttributes().get("sessionId")));
        sessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming WebSocket messages here
        System.out.println("Received message: " + message.getPayload());
        // Broadcast the message to all connected clients
        // broadcastMessage("Broadcast from " + session.getAttributes().get("sessionId")
        // + ": " + message.getPayload());

        JsonNode json = new ObjectMapper().readTree(message.getPayload());
        String messageType = json.get("type").asString();

        switch (messageType) {
            case "JOIN":
                String gameId = json.get("gameId").asString();
                handleJoinGame(session, gameId);
                break;
            default:
                break;
        }
    }

    private void handleJoinGame(WebSocketSession session, String gameId) {
        sessionsByGame.putIfAbsent(gameId, Collections.synchronizedSet(new HashSet<>()));
        sessionsByGame.get(gameId).add(session);
        System.out.println("Session " + session.getAttributes().get("sessionId") + " joined game " + gameId);
    }

    private void broadcastGameMessage(String gameId, String message) throws Exception {
        Set<WebSocketSession> sessions = sessionsByGame.get(gameId);
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }
}
