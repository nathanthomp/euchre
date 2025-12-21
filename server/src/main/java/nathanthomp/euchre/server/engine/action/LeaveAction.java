package nathanthomp.euchre.server.engine.action;

import java.util.List;
import java.util.Map;

import org.springframework.web.socket.WebSocketSession;

import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.event.EventType;
import nathanthomp.euchre.server.engine.game.Game;
import nathanthomp.euchre.server.engine.player.Player;
import nathanthomp.euchre.server.engine.player.PlayerRegistry;

public class LeaveAction implements Action {
    private final WebSocketSession session;
    private final PlayerRegistry playerRegistry;

    public LeaveAction(PlayerRegistry playerRegistry, WebSocketSession session) {
        this.playerRegistry = playerRegistry;
        this.session = session;
    }

    @Override
    public List<Event> apply(Game game) {
        Player player = this.playerRegistry.removePlayerBySessionId(this.session.getId());
        game.removePlayer(player.getId());

        /**
         * Let the Action handle the creation of an Event
         */
        return List.of(Event.forGame(EventType.PLAYER_LEFT, game.getState(),
                Map.of("message", player.getId() + " has left the game")));
    }
}
