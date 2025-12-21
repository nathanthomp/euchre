package nathanthomp.euchre.server.engine.event;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import nathanthomp.euchre.server.engine.game.Game;
import nathanthomp.euchre.server.engine.player.Player;
import tools.jackson.databind.ObjectMapper;

@Component
public class EventDispatcher {
    private final ObjectMapper mapper = new ObjectMapper();

    public void dispatch(Game game, Event event, Map<String, WebSocketSession> sessions) throws IOException {
        switch (event.getTarget().getType()) {
            case GAME:
                dispatchToGame(game, event, sessions);
                break;
            case PLAYER:
                dispatchToPlayer(event.getTarget().getSessionId(), event, sessions);
                break;
            default:
                break;
        }
    }

    private void dispatchToGame(Game game, Event event, Map<String, WebSocketSession> sessions) throws IOException {
        String json = mapper.writeValueAsString(event.getPayload());
        Collection<Player> players = game.getPlayers();
        for (Player player : players) {
            WebSocketSession playerSession = sessions.get(player.getSessionId());
            if (playerSession.isOpen()) {
                playerSession.sendMessage(new TextMessage(json));
            }
        }
    }

    private void dispatchToPlayer(String sessionId, Event event, Map<String, WebSocketSession> sessions)
            throws IOException {
        String json = mapper.writeValueAsString(event.getPayload());
        WebSocketSession playerSession = sessions.get(sessionId);
        if (playerSession.isOpen()) {
            playerSession.sendMessage(new TextMessage(json));
        }
    }
}
