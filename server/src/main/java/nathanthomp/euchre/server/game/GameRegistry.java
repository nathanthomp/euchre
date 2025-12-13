package nathanthomp.euchre.server.game;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class GameRegistry {
    private final Map<String, Game> games = new ConcurrentHashMap<>();

    public Game createGame() {
        String gameId = UUID.randomUUID().toString();
        Game game = new Game(gameId);
        games.put(gameId, game);
        return game;
    }

    public Game getGame(String gameId) {
        return games.get(gameId);
    }
}
