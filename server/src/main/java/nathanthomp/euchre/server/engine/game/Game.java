package nathanthomp.euchre.server.engine.game;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import nathanthomp.euchre.server.engine.hand.Hand;
import nathanthomp.euchre.server.engine.player.Player;
import nathanthomp.euchre.server.engine.team.Team;

public class Game {
    private final String id;
    private final Map<String, Team> teams = new ConcurrentHashMap<>();

    private GameState state = GameState.WAITING;

    /**
     * Game controls the order that players are "Sitting At"
     */
    private List<Player> playerOrder = new ArrayList<>();

    private Hand currentHand;

    public Game(String gameId) {
        this.id = gameId;
        this.teams.put("RED", new Team());
        this.teams.put("BLACK", new Team());

    }

    public String getId() {
        return id;
    }

    public Team getTeam(String team) {
        return this.teams.get(team);
    }

    public Collection<Player> getPlayers() {
        Collection<Player> result = new ArrayList<>();
        for (Team team : this.teams.values()) {
            result.addAll(team.getPlayers());
        }
        return result;
    }

    public void removePlayer(String playerId) {
        for (Team team : this.teams.values()) {
            team.removePlayer(playerId);
        }
    }

    public GameState getState() {
        return state;
    }

    public void changeState(GameState newState) {
        this.state = newState;
    }

    public void start() {
        this.state = GameState.PLAYING;

        this.state = GameState.DEALING;
        /**
         * Get dealing order
         */
        ArrayList<Player> teamBlackPlayers = new ArrayList<>(this.teams.get("BLACK").getPlayers());
        ArrayList<Player> teamRedPlayers = new ArrayList<>(this.teams.get("RED").getPlayers());

        this.playerOrder.add(0, teamBlackPlayers.get(0));
        this.playerOrder.add(1, teamRedPlayers.get(0));
        this.playerOrder.add(2, teamBlackPlayers.get(1));
        this.playerOrder.add(3, teamRedPlayers.get(1));

        this.currentHand = new Hand(null, this.playerOrder.get(0));
        this.currentHand.dealCards(this.getPlayers());
        /**
         * Once the decision that is over, the trump suit will be
         * deterined, and we can
         * add it to the current Hand.
         */
    }

    public Hand getCurrentHand() {
        return this.currentHand;
    }

    public Player getNextPlayer(Player previousPlayer) {
        int previousPlayerIndex = this.playerOrder.indexOf(previousPlayer);
        int nextPlayerIndex = (previousPlayerIndex + 1) % this.playerOrder.size();
        return this.playerOrder.get(nextPlayerIndex);
    }
}
