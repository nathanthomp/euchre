package nathanthomp.euchre.server.engine.trick;

import java.util.ArrayList;
import java.util.List;

import nathanthomp.euchre.server.engine.card.Card;
import nathanthomp.euchre.server.engine.card.CardSuit;
import nathanthomp.euchre.server.engine.card.PlayedCard;
import nathanthomp.euchre.server.engine.player.Player;

public class Trick {
    private final List<PlayedCard> playedCards = new ArrayList<>();
    private final Player leader;
    private final CardSuit trump;

    private Player currentPlayer;

    public Trick(Player leader, CardSuit trump) {
        this.leader = leader;
        this.trump = trump;
        this.currentPlayer = leader;
    }

    public void playCard(Player player, Card card) {
        playedCards.add(new PlayedCard(player, card));
    }

    // public Player determineWinner() {
    // // Simplified logic for determining the winner of the trick
    // // Use a strategy pattern for trump and led suit rules in a real
    // implementation
    // }
}
