/**
 * Similar to an event, but one that has happened
 */

import { Game } from "./game";
import { Player } from "./player";
import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

/**
 * Action: JOIN_GAME
 * Event: PLAYER_JOINED
 *
 * Action: LEAVE_GAME
 * Event: PLAYER_LEFT
 *
 * Action: START_GAME
 * Event: GAME_STARTED
 *
 * Action: PLAY_CARD
 * Event:
 * - Depends on the status of the game
 * - If play card results in the end of a trick
 * - If play card
 */
export enum EventType {
    ERROR,
    PLAYER_JOINED,
    PLAYER_LEFT,
    PLAYER_DISCONNECTED,
}

export class Event {
    public static forPlayer(
        player: Player,
        type: EventType,
        payload: any,
    ): Event {
        const event = new Event(type, payload);
        event.connections.push(player.connectionId);
        return event;
    }

    public static forGame(game: Game, type: EventType, payload: any): Event {
        const event = new Event(type, payload);
        for (const player of game.getPlayers()) {
            event.connections.push(player.connectionId);
        }
        return event;
    }

    public static forError(player: Player, message: string): Event {
        return this.forPlayer(player, EventType.ERROR, {
            message: message,
        });
    }

    public static forConnectionId(
        connectionId: string,
        type: EventType,
        payload: any,
    ) {
        const event = new Event(type, payload);
        event.connections.push(connectionId);
        return event;
    }

    private connections: string[] = [];
    private data: any;

    private constructor(type: EventType, payload: any) {
        this.data = { ...payload, type: type };
    }

    public getConnections(): string[] {
        return this.connections;
    }

    public getData(): any {
        return this.data;
    }
}

export class EventManager {
    public constructor(
        private readonly client: ApiGatewayManagementApiClient,
    ) {}

    public async send(event: Event) {
        for (const connection of event.getConnections()) {
            console.log(`Sending event to ${connection}`);
            try {
                await this.client.send(
                    new PostToConnectionCommand({
                        ConnectionId: connection,
                        Data: Buffer.from(JSON.stringify(event.getData())),
                    }),
                );
            } catch (error) {
                console.error(`Failed send to ${connection}`, error);
            }
        }
    }
}
