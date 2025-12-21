package nathanthomp.euchre.server.engine.event;

public class EventTarget {
    public static EventTarget forGame() {
        return new EventTarget(EventTargetType.GAME, null);
    }

    public static EventTarget forPlayer(String sessionId) {
        return new EventTarget(EventTargetType.PLAYER, sessionId);
    }

    private final EventTargetType type;
    private final String sessionId; // Only relevant if type is PLAYER

    private EventTarget(EventTargetType type, String sessionId) {
        this.type = type;
        this.sessionId = sessionId;
    }

    public EventTargetType getType() {
        return type;
    }

    public String getSessionId() {
        return sessionId;
    }
}
