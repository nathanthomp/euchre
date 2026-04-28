import { Event, EventType } from "./event";
import { Game, GameState } from "./game";
import { Player } from "./player";
import { Request } from "./request";

export abstract class Action {
    protected event: Event | undefined;

    constructor(protected request: Request) {}

    public abstract canApply(game: Game): boolean;
    public abstract apply(game: Game): void;

    public getEvent(): Event {
        if (this.event) {
            return this.event;
        }
        throw new Error("Cannot get event for action");
    }

    public static get(request: Request): Action {
        switch (request.action) {
            case "JOIN_GAME":
                return new JoinAction(request);
            case "LEAVE_GAME":
                return new LeaveAction(request);
            case "START_GAME":
                return new StartAction(request);
            default:
                throw new Error(`Unknown action: ${request.action}`);
        }
    }
}

class JoinAction extends Action {
    public override canApply(game: Game): boolean {
        if (game.getPlayers.length == 4) {
            this.event = Event.forError(
                Player.fromRequest(this.request),
                "Error: Game is full",
            );
            return false;
        }

        if (
            game
                .getPlayers()
                .some((player) => player.username == this.request.username)
        ) {
            this.event = Event.forError(
                Player.fromRequest(this.request),
                `Error: player with username '${this.request.username}' already exists`,
            );
            return false;
        }

        return true;
    }

    public override apply(game: Game): void {
        const joiningPlayer = Player.fromRequest(this.request);
        game.addPlayer(joiningPlayer);
        joiningPlayer.save();
        this.event = Event.forGame(game, EventType.PLAYER_JOINED, {
            message: `${this.request.username} joined the game`,
        });
    }
}

class LeaveAction extends Action {
    public override canApply(game: Game): boolean {
        // Player must be in the game
        return true;
    }

    public override apply(game: Game): void {
        const leavingPlayer = Player.fromRequest(this.request);
        game.removePlayer(leavingPlayer);
        // leavingPlayer.update();
        this.event = Event.forGame(game, EventType.PLAYER_LEFT, {
            message: `${this.request.username} left the game`,
        });
    }
}

class StartAction extends Action {
    public override canApply(game: Game): boolean {
        if (
            game.getPlayers().length == 4 &&
            game.getState() == GameState.WAITING
        ) {
            return true;
        }

        this.event = Event.forError(
            Player.fromRequest(this.request),
            "Cannot start game",
        );

        return false;
    }

    public override apply(game: Game): void {
        game.start();
    }
}
