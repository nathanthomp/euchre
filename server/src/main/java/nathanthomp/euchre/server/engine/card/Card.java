package nathanthomp.euchre.server.engine.card;

public class Card {
    private final CardSuit suit;
    private final CardType type;

    public Card(CardSuit suit, CardType type) {
        this.suit = suit;
        this.type = type;
    }

    public CardSuit getSuit() {
        return suit;
    }

    public CardType getType() {
        return type;
    }

    @Override
    public String toString() {
        return this.type + " of " + this.suit;
    }
}
