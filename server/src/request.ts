import { WebSocketEvent } from "./lambdas/websocket.handler";

export class Request {
    constructor(
        public connectionId: string,
        public gamecode: string,
        public username: string,
        public action: string,
    ) {}

    public static fromEvent(event: WebSocketEvent): Request {
        if (!event.body) {
            throw new Error("Missing event.body in event");
        }

        let json: any;
        try {
            json = JSON.parse(event.body);
        } catch (error) {
            throw new Error("Invalid event.body in event");
        }

        /**
         * Move this validation to Action?
         */
        let { gamecode, username, action } = json;

        if (!(gamecode && username && action)) {
            throw new Error("Invalid request");
        }

        return new Request(
            event.requestContext.connectionId,
            gamecode,
            username,
            action,
        );
    }
}
