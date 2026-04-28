import { Entity } from "./entity";
import { Request } from "./request";

export class Player extends Entity {
    public static fromRequest(request: Request): Player {
        return new Player(request.username, request.connectionId);
    }

    public constructor(
        public username: string,
        public connectionId: string,
    ) {
        super();
    }

    public save(): void {}
}
