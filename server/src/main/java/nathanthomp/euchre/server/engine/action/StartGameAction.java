package nathanthomp.euchre.server.engine.action;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.web.socket.WebSocketSession;

import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.event.EventType;
import nathanthomp.euchre.server.engine.game.Game;
import nathanthomp.euchre.server.engine.game.GameState;
import nathanthomp.euchre.server.engine.player.Player;

public class StartGameAction implements Action {
    /**
     * Investigate changing this to sessionId only to save on size
     */
    private final WebSocketSession session;

    public StartGameAction(WebSocketSession session) {
        this.session = session;
    }

    @Override
    public List<Event> apply(Game game) {
        /**
         * Check if RED team is full
         */
        if (!game.getTeam("RED").isFull()) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Error starting game: RED team must be full")));
        }

        /**
         * Check if BLACK team is full
         */
        if (!game.getTeam("BLACK").isFull()) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Error starting game: BLACK team must be full")));
        }

        /**
         * Check if game is already started
         */
        if (game.getState() == GameState.PLAYING) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Error starting game: Game is already started")));
        }

        // game.changeState(GameState.PLAYING)
        if (game.getCurrentHand() == null) {
            // We know that this is the first hand of the game
        }
        List<Event> events = new LinkedList<>();

        /**
         * The only thing to do after this would be to change the state of the game.
         * Once the state of the game has been changed, get the events from the state.
         */

        game.start();
        /**
         * Event for Game: PlayerId is the dealer
         * Event for Player: Here are your cards
         */
        events.add(Event.forGame(EventType.GAME_STARTED, game.getState(), Map.of("message", "The game has started")));
        events.add(Event.forGame(EventType.PLAYER_DEALING, game.getState(),
                Map.of("message", game.getCurrentHand().getDealer().getId() + " is dealing")));

        for (Player player : game.getPlayers()) {
            events.add(Event.forPlayer(player.getSessionId(), game.getState(), EventType.PLAYER_CARDS_DEALT,
                    Map.of("cards", player.getCards().toString())));
        }

        events.add(Event.forGame(EventType.UPCARD_SHOWN, game.getState(),
                Map.of("upcard", game.getCurrentHand().getUpcard())));

        return events;
    }
}
