package nathanthomp.euchre.server.engine.event;

public enum EventType {
    ERROR,

    PLAYER_JOINED,
    PLAYER_LEFT,
    PLAYER_DISCONNECTED,
    PLAYER_DEALING,
    PLAYER_CARDS_DEALT,

    UPCARD_SHOWN,

    GAME_STARTED,
    GAME_PAUSED,
    GAME_RESUMED,
    GAME_FINISHED,
    GAME_WON,
    GAME_LOST
}