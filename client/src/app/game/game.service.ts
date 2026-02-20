import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface GameInformation {
    mode: "create" | "join";
    username: string;
    gamecode: string | undefined;
}

@Injectable({ providedIn: "root" })
export class GameService {
    private setupInformation: GameInformation | null = null;

    setSetupInformation(
        mode: "create" | "join",
        username: string,
        gamecode?: string,
    ) {
        this.setupInformation = { mode, username, gamecode };
    }

    getSetupInformation(): GameInformation | null {
        return this.setupInformation;
    }

    clearSetupInformation() {
        this.setupInformation = null;
    }

    async setup(): Promise<{ username: string; gamecode: string }> {
        // DEBUGGING
        this.setSetupInformation("join", "nathan", "1234-5678"); // REMOVE

        if (this.setupInformation!.mode == "create") {
            this.setupInformation!.gamecode = await this.createGame();
        }

        await this.connect(this.setupInformation!.gamecode!);

        return {
            username: this.setupInformation!.username,
            gamecode: this.setupInformation!.gamecode!,
        };
    }

    private async createGame(): Promise<string> {
        try {
            console.log(`Creating game...`);
            const gamecode = "gamecode123";
            await this.wait(500);
            console.log(`Game created with code ${gamecode}`);
            return gamecode;
        } catch (error) {
            console.log(error);
            throw new Error("Could Not Create Game.");
        }
    }

    private webSocket: WebSocket | null = null;

    private messagesSubject = new Subject<any>();
    messages$: Observable<any> = this.messagesSubject.asObservable();

    private async connect(gamecode: string): Promise<void> {
        try {
            console.log(`Connecting...`);
            await this.wait(500);
            console.log(`Connected`);
        } catch (error) {
            console.log(error);
            throw new Error("Could Not Connect to Server");
        }

        // if (this.webSocket) {
        //     console.warn("WebSocket is already connected.");
        //     return;
        // }
        // this.webSocket = new WebSocket(`ws://localhost:8080/game/${gamecode}`);
        // this.webSocket.onopen = () => {
        //     console.log("WebSocket connection established.");
        // };
        // this.webSocket.onmessage = (event) => {
        // const message = JSON.parse(event.data);
        // this.messagesSubject.next(message);
        //     console.log("Received message:", event.data);
        // };
        // this.webSocket.onclose = () => {
        //     console.log("WebSocket connection closed.");
        //     this.webSocket = null;
        // };
        // this.webSocket.onerror = (error) => {
        //     console.error("WebSocket error:", error);
        // };
    }

    disconnect(): void {
        console.log(`Disconnecting...`);
    }

    private send(message: string) {
        if (this.webSocket) {
            this.webSocket.send(message);
        }
    }

    async joinGame(username: string, gamecode: string): Promise<void> {
        try {
            console.log(`Joining game...`);
            await this.wait(500);
            console.log(`Joined game with code ${gamecode} as ${username}`);
            this.messagesSubject.next(
                JSON.stringify({
                    gamecode: gamecode,
                    state: "WAITING",
                    type: "PLAYER_JOINED",
                    joinedPlayer: username,
                }),
            );
        } catch (error) {
            console.log(error);
            throw new Error("Could Not Join Game");
        }
    }

    async leaveGame(): Promise<void> {
        console.log(`Leaving game...`);
        await this.wait(2000);
        console.log(`Left game`);

        // if (this.webSocket) {
        //     this.webSocket.close();
        //     this.webSocket = null;
        // }
    }

    async startGame(username: string, gamecode: string) {
        console.log("Starting game...");
        this.messagesSubject.next(
            JSON.stringify({
                gamecode: gamecode,
                state: "BIDDING",
                type: "GAME_STARTED",
                startedByPlayer: username,
            }),
        );
    }

    async sendChatMessage(message: string) {
        this.send(message);
    }

    private async wait(ms: number) {
        return new Promise((resolve, reject) => {
            if (typeof ms !== "number" || ms < 0) {
                reject(new Error("Delay time must be a non-negative number."));
                return;
            }
            setTimeout(resolve, ms);
        });
    }
}
