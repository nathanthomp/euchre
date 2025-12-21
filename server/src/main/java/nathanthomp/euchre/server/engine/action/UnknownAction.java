package nathanthomp.euchre.server.engine.action;

import java.util.List;
import java.util.Map;

import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.event.EventType;
import nathanthomp.euchre.server.engine.game.Game;

public class UnknownAction implements Action {
    public final String type;
    public final String sessionId;

    public UnknownAction(String type, String sessionId) {
        this.type = type;
        this.sessionId = sessionId;
    }

    @Override
    public List<Event> apply(Game game) {
        return List.of(Event.forPlayer(sessionId, game.getState(), EventType.ERROR,
                Map.of("message", "Unknown action type: " + type)));
    }
}
