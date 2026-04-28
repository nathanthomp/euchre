import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    QueryCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { Player } from "./player";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Entity } from "./entity";

export enum GameState {
    WAITING,
    BIDDING,
}

// type GameState = "WAITING" | "BIDDING" | ""

export class Game extends Entity {
    public dealer: Player | undefined;

    private constructor(
        public code: string,
        private state: GameState,
        private players: Player[],
    ) {
        super();
    }

    public start() {
        // Determine the first dealer
        // Update state
    }

    /**
     * Entity
     */

    public static create() {
        return new Game("Something", GameState.WAITING, []);
    }

    public getState(): GameState {
        return this.state;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
    }

    public removePlayer(player: Player): void {}

    // private getNextGameState();
}
