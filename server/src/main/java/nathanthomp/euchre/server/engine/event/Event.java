package nathanthomp.euchre.server.engine.event;

import java.util.Map;

import nathanthomp.euchre.server.engine.game.GameState;

public class Event {
    public static Event forGame(EventType type, GameState state, Map<String, Object> payload) {
        return new Event(type, state, EventTarget.forGame(), payload);
    }

    public static Event forPlayer(String sessionId, GameState state, EventType type, Map<String, Object> payload) {
        return new Event(type, state, EventTarget.forPlayer(sessionId), payload);
    }

    private final EventType type;
    private final GameState state;
    private final EventTarget target;
    private final Map<String, Object> payload;

    // private final GameState gameState;
    // private final String message;

    // GameState gameState, String message

    private Event(EventType type, GameState state, EventTarget target, Map<String, Object> payload) {
        this.type = type;
        this.target = target;
        this.payload = payload;
        this.state = state;
    }

    public EventType getType() {
        return this.type;
    }

    public EventTarget getTarget() {
        return this.target;
    }

    public Map<String, Object> getPayload() {
        return Map.of("type", this.type, "gameState", this.state, "payload", this.payload);
    }
}
