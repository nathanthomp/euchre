import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GameService } from "../game/game.service";

@Component({
    selector: "menu",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./menu.component.html",
    styleUrl: "./menu.component.css",
})
export class MenuComponent {
    createForm;
    joinForm;

    active: "none" | "create" | "join" = "none";
    submitted = false;

    constructor(
        private router: Router,
        private gameService: GameService,
        formBuilder: FormBuilder,
    ) {
        this.createForm = formBuilder.group({
            username: ["", [Validators.required, Validators.minLength(2)]],
        });
        this.joinForm = formBuilder.group({
            username: ["", [Validators.required, Validators.minLength(2)]],
            gamecode: ["", [Validators.required]],
        });
    }

    showCreate() {
        this.active = "create";
        this.submitted = false;
        this.createForm.reset();
    }

    showJoin() {
        this.active = "join";
        this.submitted = false;
        this.joinForm.reset();
    }

    submitCreate() {
        this.submitted = true;
        if (this.createForm.invalid) {
            console.log("Form errors:", this.createForm.errors);
            return;
        }

        const username = this.createForm.get("username")!.value;

        this.gameService.setSetupInformation("create", username!);
        this.router.navigate(["/play"]);
    }

    cancelCreate() {
        this.active = "none";
        this.submitted = false;
        this.createForm.reset();
    }

    submitJoin() {
        this.submitted = true;
        if (this.joinForm.invalid) {
            console.log("Form errors:", this.joinForm.errors);
            return;
        }

        const username = this.joinForm.get("username")!.value;
        const gamecode = this.joinForm.get("gamecode")!.value;

        this.gameService.setSetupInformation("join", username!, gamecode!);
        this.router.navigate(["/play"]);
    }

    cancelJoin() {
        this.active = "none";
        this.submitted = false;
        this.joinForm.reset();
    }
}
