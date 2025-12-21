package nathanthomp.euchre.server.engine.player;

import java.util.HashSet;
import java.util.Set;

import nathanthomp.euchre.server.engine.card.Card;

public class Player {
    private final String id;
    private final String sessionId;
    private final Set<Card> cards = new HashSet<>();

    public Player(String id, String sessionId) {
        this.id = id;
        this.sessionId = sessionId;
    }

    public String getId() {
        return id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public Set<Card> getCards() {
        return this.cards;
    }

    public void addCard(Card card) {
        this.cards.add(card);
    }
}
