import { Game } from "./game";

export abstract class Action {
    constructor() {}

    public abstract canExecute(game: Game): boolean;
    public abstract execute(game: Game): void;

    // public getAction(): Action {}
}

export class JoinAction extends Action {
    public override canExecute(game: Game): boolean {
        throw new Error("Method not implemented.");
    }
    public override execute(game: Game): void {
        throw new Error("Method not implemented.");
    }
}
