package nathanthomp.euchre.server.engine.action;

import java.util.List;
import java.util.Map;

import org.springframework.web.socket.WebSocketSession;

import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.event.EventType;
import nathanthomp.euchre.server.engine.game.Game;
import nathanthomp.euchre.server.engine.player.Player;
import nathanthomp.euchre.server.engine.player.PlayerRegistry;
import nathanthomp.euchre.server.engine.team.Team;
import tools.jackson.databind.JsonNode;

public class JoinAction implements Action {
    private final PlayerRegistry playerRegistry;
    private final WebSocketSession session;
    private final JsonNode json;

    /**
     * TODO: Only take in session ID to reduce size
     */
    public JoinAction(PlayerRegistry playerRegistry, WebSocketSession session, JsonNode json) {
        this.playerRegistry = playerRegistry;
        this.session = session;
        this.json = json;
    }

    @Override
    public List<Event> apply(Game game) {
        /**
         * Implement try catch finallys for back out operations
         */
        String playerId = json.get("playerId").asString();
        String teamId = json.get("teamId").asString();

        Player player = new Player(playerId, this.session.getId());
        Team team = game.getTeam(teamId);

        /**
         * Check if player ID is already taken
         */
        if (this.playerRegistry.playerExistsById(playerId)) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Error joining game: Player ID " + playerId + " is already taken")));
        }

        /**
         * Check if team is full
         */
        if (team.isFull()) {
            return List.of(Event.forPlayer(this.session.getId(), game.getState(), EventType.ERROR,
                    Map.of("message", "Error joining game: Team " + team + " is already full")));
        }

        team.addPlayer(player);
        this.playerRegistry.addPlayer(player);

        return List.of(
                Event.forGame(EventType.PLAYER_JOINED, game.getState(),
                        Map.of("message", player.getId() + " has joined team " + teamId)));
    }
}
