import { WebSocket } from "ws";
import Player from "./player.js";

export default class Client {
    static #url = "ws://localhost:8080/games";

    player
    
    #webSocket
    #isOpen

    constructor(player) {
        this.player = player;
        this.#webSocket = null;
        this.#isOpen = false;
    }

    connect() {
        this.#webSocket = new WebSocket(Client.#url)

        this.#webSocket.on("open", () => {
            this.#isOpen = true;
            console.log(`[${this.player.id}] connected`);
        });

        this.#webSocket.on("message", (data) => {
            const text = data.toString();
            console.log(`[${this.player.id}] ← ${text}`);
        });

        this.#webSocket.on("error", (err) => {
            console.error(`[${this.player.id}] error:`, err.message);
        });

        this.#webSocket.on("close", (code, reason) => {
            console.log(`[${this.player.id}] closed: code=${code} reason=${reason}`);
        });
    }

    async send(message) {
        while(!this.#isOpen) {
            await this.wait(500);
        }
        console.log(`[${this.player.id}] → ${message}`);
        this.#webSocket.send(message);
    }

    close() {
        this.#webSocket.close();
    }

    wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
}
