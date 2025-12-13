package nathanthomp.euchre.server.game;

public class Game {
    private final String id;

    public Game(String gameId) {
        this.id = gameId;
    }

    public String getId() {
        return id;
    }
}
