import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app",
    imports: [RouterOutlet],
    templateUrl: "./app.html",
    styleUrl: "../styles.css",
})
export class App {
    protected readonly title = signal("Euchre");
}
