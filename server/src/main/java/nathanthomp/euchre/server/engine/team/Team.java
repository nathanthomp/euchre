package nathanthomp.euchre.server.engine.team;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import nathanthomp.euchre.server.engine.player.Player;

public class Team {
    private final Map<String, Player> playersById = new ConcurrentHashMap<>();
    private int points = 0;

    public Collection<Player> getPlayers() {
        return this.playersById.values();
    }

    public Player getPlayerById(String playerId) {
        return this.playersById.get(playerId);
    }

    public void addPlayer(Player player) {
        this.playersById.put(player.getId(), player);
    }

    public void removePlayer(String playerId) {
        this.playersById.remove(playerId);
    }

    public boolean isFull() {
        return this.playersById.size() == 2;
    }

    public int getPoints() {
        return this.points;
    }

    public void addPoints(int pointsToAdd) {
        this.points += pointsToAdd;
    }
}
