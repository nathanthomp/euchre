import {
    APIGatewayEventWebsocketRequestContextV2,
    APIGatewayProxyEventV2WithRequestContext,
    APIGatewayProxyResultV2,
} from "aws-lambda";
import { Game } from "../game";
import { Action } from "../action";
import { Request } from "../request";
import { Event, EventManager, EventType } from "../event";
import { Player } from "../player";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { EntityManager } from "../entity";
import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

export type WebSocketEvent =
    APIGatewayProxyEventV2WithRequestContext<APIGatewayEventWebsocketRequestContextV2>;

export type WebSocketResult = APIGatewayProxyResultV2;

export class WebSocketHandler {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly eventManager: EventManager,
    ) {}

    public async handle(event: WebSocketEvent): Promise<WebSocketResult> {
        console.log(`Web Socket Event: ${JSON.stringify(event)}`);
        try {
            switch (event.requestContext.eventType) {
                case "CONNECT":
                    return this.handleConnect(event);
                case "DISCONNECT":
                    return this.handleDisconnect(event);
                case "MESSAGE":
                    return await this.handleMessage(event);
                default:
                    throw new Error(
                        `Unsupported event type ${event.requestContext.eventType}`,
                    );
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error }),
            };
        }
    }

    private handleConnect(event: WebSocketEvent): WebSocketResult {
        // Creates a 'player' item in dynamodb which is just the connectionId and gamecode
        const message = `${event.requestContext.connectionId} Connected`;
        console.log();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: message }),
        };
    }

    private handleDisconnect(event: WebSocketEvent): WebSocketResult {
        /**
         * Check if there is a player in a game with the connectionId
         */
        const message = `${event.requestContext.connectionId} Disconnected`;
        console.log();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: message }),
        };
    }

    private async handleMessage(
        event: WebSocketEvent,
    ): Promise<WebSocketResult> {
        // TODO: Handle
        let request: Request;
        try {
            request = Request.fromEvent(event);
        } catch (error) {
            this.eventManager.send(
                Event.forConnectionId(
                    event.requestContext.connectionId,
                    EventType.ERROR,
                    {
                        message: error,
                    },
                ),
            );
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error }),
            };
        }

        try {
            const action = Action.get(request);

            const entity = this.entityManager.query(request.gamecode);

            const game = await Game.load(request.gamecode);
            if (action.canApply(game)) {
                action.apply(game);
                await game.save();
            }
            this.eventManager.send(action.getEvent());

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Hello, from handler.ts" }),
            };
        } catch (error) {
            /**
             * Expected Error:
             * - Unknown action
             * - Could not load game
             * - Game not found
             */
            this.eventManager.send(
                Event.forPlayer(Player.fromRequest(request), EventType.ERROR, {
                    message: error,
                }),
            );

            return {
                statusCode: 400,
                body: JSON.stringify({ message: error }),
            };
        }
    }
}

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });
const entityManager = new EntityManager(dynamoClient);

const apiGatewayClient = new ApiGatewayManagementApiClient({});
const eventManager = new EventManager(apiGatewayClient);

export const handler = async (
    event: WebSocketEvent,
): Promise<WebSocketResult> => {
    return await new WebSocketHandler(entityManager, eventManager).handle(
        event,
    );
};
