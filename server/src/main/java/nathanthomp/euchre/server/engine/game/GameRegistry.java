package nathanthomp.euchre.server.engine.game;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class GameRegistry {
    private final Game game;

    public GameRegistry() {
        this.game = new Game(UUID.randomUUID().toString());
    }

    public Game getGame() {
        return game;
    }
}
