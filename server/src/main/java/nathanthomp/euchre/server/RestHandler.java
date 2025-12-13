package nathanthomp.euchre.server;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import nathanthomp.euchre.server.game.Game;
import nathanthomp.euchre.server.game.GameRegistry;

@RestController
public class RestHandler {

    @Autowired
    private GameRegistry gameRegistry;

    @PostMapping("/games/create")
    public ResponseEntity<?> createGame() {
        Game game = gameRegistry.createGame();
        System.out.println("Created new game with ID: " + game.getId());
        return ResponseEntity.ok(Map.of("gameId", game.getId()));
    }
}
