package nathanthomp.euchre.server.engine.card;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CardDeck {
    private final List<Card> cards = new ArrayList<>();

    public CardDeck() {
        for (CardSuit suit : CardSuit.values()) {
            for (CardType type : CardType.values()) {
                cards.add(new Card(suit, type));
            }
        }
    }

    public void shuffle() {
        Collections.shuffle(this.cards);
    }

    public Card deal() {
        return this.cards.remove(0);
    }

    public List<Card> getCards() {
        return this.cards;
    }
}
