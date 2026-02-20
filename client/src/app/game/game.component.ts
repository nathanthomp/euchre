import {
    Component,
    OnDestroy,
    OnInit,
    signal,
    WritableSignal,
} from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "./game.service";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { BoardComponent } from "./board/board.component";
import { ChatComponent, ChatMessage } from "./chat/chat.component";

@Component({
    selector: "game",
    standalone: true,
    imports: [CommonModule, BoardComponent, ChatComponent],
    templateUrl: "game.component.html",
    styleUrl: "game.component.css",
})
export class GameComponent implements OnInit, OnDestroy {
    username!: string;
    gamecode!: string;

    loading = signal(true);
    error: string | null = null;

    chatMessages: WritableSignal<ChatMessage[]> = signal([]);

    private subscription!: Subscription;

    state: string = "UNKNOWN";
    players: string[] = [];

    cards: string[] = [];

    constructor(
        private router: Router,
        private gameService: GameService,
    ) {}

    ngOnInit(): void {
        // if (!this.gameService.getSetupInformation()) {
        //     console.warn("No setup information found, redirecting to menu");
        //     this.router.navigate([""]);
        //     return;
        // }

        this.gameService
            .setup()
            .then(({ username, gamecode }) => {
                this.username = username;
                this.gamecode = gamecode;

                this.subscription = this.gameService.messages$.subscribe(
                    (message) => {
                        this.handleMessage(message);
                    },
                );

                return this.gameService.joinGame(this.username, this.gamecode);
            })
            .catch((error) => {
                this.error = error;
            })
            .finally(() => {
                this.loading.set(false);
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.gameService.clearSetupInformation();
        this.gameService.leaveGame();
        this.gameService.disconnect();
    }

    handleMessage(message: any) {
        const json = JSON.parse(message);
        this.state = json.state;
        switch (json.type) {
            case "PLAYER_JOINED":
                const joinedPlayer = json.joinedPlayer;
                this.chatMessages.update((messages) => [
                    ...messages,
                    {
                        username: joinedPlayer,
                        message: "joined the game",
                    } as ChatMessage,
                ]);
                this.players.push(joinedPlayer);
                break;
            case "GAME_STARTED":
                const startedByPlayer = json.startedByPlayer;
                this.chatMessages.update((messages) => [
                    ...messages,
                    {
                        username: startedByPlayer,
                        message: "started the game",
                    } as ChatMessage,
                ]);
                break;
            default:
                console.log(`Unknown message type: ${json.type}`);
                break;
        }
    }

    onChatMessage(message: string) {
        this.gameService.sendChatMessage(message);
    }

    retry(): void {
        this.loading.set(true);
        this.error = null;
        this.ngOnInit();
    }

    cancel(): void {
        this.router.navigate([""]);
    }

    leaveGame() {
        this.router.navigate([""]);
    }

    startGame() {
        this.gameService.startGame(this.username, this.gamecode);
    }

    pass() {}

    order() {}

    call() {}

    addPlayersForDebugging() {
        const usernames = ["player1", "player2", "player3"];
        const joinPromises = usernames.map((username) =>
            this.gameService.joinGame(username, this.gamecode),
        );

        Promise.all(joinPromises)
            .then(() => {
                console.log("✅ All debug players joined!");
            })
            .catch((error) => {
                console.error("❌ Some players failed to join:", error);
            });
    }
}
