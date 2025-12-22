package nathanthomp.euchre.server.engine.action;

import java.util.List;
import java.util.Map;

import org.springframework.web.socket.WebSocketSession;

import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.event.EventType;
import nathanthomp.euchre.server.engine.game.Game;
import nathanthomp.euchre.server.engine.game.GameState;
import nathanthomp.euchre.server.engine.player.Player;
import nathanthomp.euchre.server.engine.player.PlayerRegistry;

public class PassAction implements Action {
    private PlayerRegistry playerRegistry;
    private WebSocketSession session;

    public PassAction(PlayerRegistry playerRegistry, WebSocketSession session) {
        this.session = session;
        this.playerRegistry = playerRegistry;
    }

    @Override
    public List<Event> apply(Game game) {
        if (game.getState() != GameState.BIDDING) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Invalid action: game is not in a BIDDING state")));
        }

        Player player = playerRegistry.getPlayerBySessionId(this.session.getId());

        if (!player.equals(game.getCurrentHand().getCurrentBidder())) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Invalid action: not current bidder")));
        }

        game.getCurrentHand().setCurrentBidder(game.getNextPlayer(player));

        return List.of(Event.forGame(EventType.PLAYER_PASSED, game.getState(),
                Map.of("message", "Player " + player.getId() + " passed")));
    }

}
