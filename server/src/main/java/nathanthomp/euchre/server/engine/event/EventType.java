package nathanthomp.euchre.server.engine.event;

public enum EventType {
    ERROR,

    PLAYER_JOINED,
    PLAYER_LEFT,
    PLAYER_DISCONNECTED,

    PLAYER_DEALING,
    CARDS_DEALT,
    PLAYER_PASSED,
    PLAYER_ORDERED_UP,
    PLAYER_CALLED,

    GAME_STARTED,
    GAME_PAUSED,
    GAME_RESUMED,
    GAME_FINISHED,
    GAME_WON,
    GAME_LOST
}