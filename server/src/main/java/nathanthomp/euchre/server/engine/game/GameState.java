package nathanthomp.euchre.server.engine.game;

public enum GameState {
    /**
     * JOIN
     * LEAVE
     * DISCONNECT
     */
    WAITING,
    /**
     * server -> PLAYER_DEALING (Game Event)
     * 
     * Combine these two
     * server -> CARDS_DEALT (Player Event)
     * server -> UPCARD_SHOWN (Game Event)
     */
    DEALING,
    /**
     * player1 -> ORDER_UP / PASS
     * player2 -> ORDER_UP / PASS
     * player3 -> ORDER_UP / PASS
     * player4 -> ORDER_UP / PASS
     * player1 -> CALL / PASS
     * player2 -> CALL / PASS
     * player3 -> CALL / PASS
     * player4 -> CALL
     */
    BIDDING,
    PLAYING,
    COMPLETED
}
