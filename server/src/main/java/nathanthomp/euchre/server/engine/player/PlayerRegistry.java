package nathanthomp.euchre.server.engine.player;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class PlayerRegistry {
    private final Map<String, Player> playersById = new ConcurrentHashMap<>();
    private final Map<String, Player> playersBySession = new ConcurrentHashMap<>();

    public void addPlayer(Player player) {
        playersById.put(player.getId(), player);
        playersBySession.put(player.getSessionId(), player);
    }

    public Player removePlayerBySessionId(String sessionId) {
        Player removedPlayer = playersBySession.remove(sessionId);
        playersById.remove(removedPlayer.getId());
        return removedPlayer;
    }

    public Player getPlayerBySessionId(String sessionId) {
        return playersBySession.get(sessionId);
    }

    public boolean playerExistsById(String playerId) {
        return playersById.containsKey(playerId);
    }
}
