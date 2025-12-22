package nathanthomp.euchre.server.engine.action;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import nathanthomp.euchre.server.engine.player.PlayerRegistry;
import tools.jackson.databind.JsonNode;

@Component
public class ActionFactory {
    private PlayerRegistry playerRegistry;

    public ActionFactory(PlayerRegistry playerRegistry) {
        this.playerRegistry = playerRegistry;
    }

    public Action getAction(WebSocketSession session, JsonNode json) {
        String type = json.get("type").asString();
        switch (type) {
            case "JOIN":
                // {"type":"JOIN","playerId":"player1","teamId":"RED"}
                return new JoinAction(this.playerRegistry, session, json);
            case "LEAVE":
                // {"type":"LEAVE"}
                return new LeaveAction(this.playerRegistry, session);
            case "START_GAME":
                // {"type":"START_GAME"}
                return new StartGameAction(session);
            case "PASS":
                // {"type":"PASS"}
                return new PassAction(this.playerRegistry, session);
            default:
                return new UnknownAction(type, session.getId());
        }
    }
}
