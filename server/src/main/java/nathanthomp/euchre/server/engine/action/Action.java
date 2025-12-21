package nathanthomp.euchre.server.engine.action;

import java.util.List;

import nathanthomp.euchre.server.engine.event.Event;
import nathanthomp.euchre.server.engine.game.Game;

public interface Action {
    /**
     * Possibly change to abstract class and add Game getGame() method here later
     */
    List<Event> apply(Game game);
}
