import { CommonModule } from "@angular/common";
import {
    Component,
    EventEmitter,
    Input,
    Output,
    signal,
    WritableSignal,
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";

export interface ChatMessage {
    username: string;
    message: string;
}

@Component({
    selector: "chat",
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "chat.component.html",
    styleUrl: "../game.component.css",
})
export class ChatComponent {
    @Input({ required: true }) username!: string;
    @Input({ required: true }) chatMessages!: WritableSignal<ChatMessage[]>;
    @Input() sending = signal(false);

    @Output() sendChatMessageEvent = new EventEmitter<string>();

    chatForm: FormGroup;

    constructor(formBuilder: FormBuilder) {
        this.chatForm = formBuilder.group({
            message: ["", Validators.required],
        });
    }

    sendChatMessage() {
        if (this.chatForm.valid) {
            // this.sendChatMessageEvent.emit(
            //     this.chatForm.get("message")!.value!,
            // );
            this.chatMessages.update((messages) => [
                ...messages,
                {
                    username: this.username,
                    message: this.chatForm.get("message")!.value,
                } as ChatMessage,
            ]);
            this.chatForm.reset();
        }
    }
}
