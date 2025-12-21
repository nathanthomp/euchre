package nathanthomp.euchre.server.engine.card;

import nathanthomp.euchre.server.engine.player.Player;

public class PlayedCard {
    private final Player player;
    private final Card card;

    public PlayedCard(Player player, Card card) {
        this.player = player;
        this.card = card;
    }

    public Player getPlayer() {
        return player;
    }

    public Card getCard() {
        return card;
    }
}
