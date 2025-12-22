package nathanthomp.euchre.server.websocket;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import nathanthomp.euchre.server.engine.action.Action;
import nathanthomp.euchre.server.engine.action.ActionFactory;
import nathanthomp.euchre.server.engine.action.DisconnectAction;
import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.event.EventDispatcher;
import nathanthomp.euchre.server.engine.game.Game;
import nathanthomp.euchre.server.engine.game.GameRegistry;
import nathanthomp.euchre.server.engine.player.PlayerRegistry;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private GameRegistry gameRegistry;

    @Autowired
    private PlayerRegistry playerRegistry;

    @Autowired
    private ActionFactory actionFactory;

    @Autowired
    private EventDispatcher eventDispatcher;

    /**
     * TODO: SessionRegistry class to manage sessions more robustly (e.g., handle
     * reconnections, timeouts, etc.)
     */
    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        System.out.println("WebSocket session: " + session.getId() + " established");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        System.out.println("WebSocket session: " + session.getId() + " closed with status: " + status);

        if (this.playerRegistry.getPlayerBySessionId(session.getId()) != null) {
            Action action = new DisconnectAction(this.playerRegistry, session);

            Game game = this.gameRegistry.getGame();
            List<Event> events = action.apply(game);
            for (Event event : events) {
                this.eventDispatcher.dispatch(game, event, sessions);
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message from session " + session.getId() + ": " + message.getPayload());

        JsonNode json = mapper.readTree(message.getPayload());
        Action action = this.actionFactory.getAction(session, json);

        Game game = this.gameRegistry.getGame();
        List<Event> events = action.apply(game);

        for (Event event : events) {
            this.eventDispatcher.dispatch(game, event, sessions);
        }
    }
}
