package nathanthomp.euchre.server.engine.hand;

import java.util.Collection;
import java.util.List;

import nathanthomp.euchre.server.engine.card.Card;
import nathanthomp.euchre.server.engine.card.CardDeck;
import nathanthomp.euchre.server.engine.card.CardSuit;
import nathanthomp.euchre.server.engine.card.CardType;
import nathanthomp.euchre.server.engine.player.Player;
import nathanthomp.euchre.server.engine.trick.Trick;

public class Hand {
    // Hand implementation, currentTrick
    private final CardSuit trump;
    private final Player dealer;

    private Trick currentTrick;

    private List<Card> kitty;

    public Hand(CardSuit trump, Player dealer) {
        this.trump = trump;
        this.dealer = dealer;
    }

    public Player getDealer() {
        return this.dealer;
    }

    public void dealCards(Collection<Player> players) {
        CardDeck deck = new CardDeck();
        deck.shuffle();
        for (Player player : players) {
            for (int i = 0; i < 5; i++) {
                Card card = deck.deal();
                player.addCard(card);
            }
        }
        this.kitty = deck.getCards();
    }

    public Card getUpcard() {
        return this.kitty.remove(0);
    }
}
