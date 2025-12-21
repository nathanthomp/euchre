package nathanthomp.euchre.server.engine.action;

import java.util.List;

import nathanthomp.euchre.server.engine.card.CardSuit;
import nathanthomp.euchre.server.engine.card.CardType;
import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.game.Game;

public class PlayCardAction implements Action {
    private final String playerId;
    private final CardSuit cardSuit;
    private final CardType cardType;

    public PlayCardAction(String playerId, CardSuit cardSuit, CardType cardType) {
        this.playerId = playerId; // Get player id from session
        this.cardSuit = cardSuit;
        this.cardType = cardType;
    }

    @Override
    public List<Event> apply(Game game) {
        // Implementation for playing a card in the game
        /**
         * game.getCurrentHand().getCurrentTrick().playCard(playerId, new
         * Card(this.cardSuit, this.cardType));
         */
        return null; // Placeholder return
    }
}
