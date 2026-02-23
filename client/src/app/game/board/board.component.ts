import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "board",
    imports: [CommonModule],
    templateUrl: "board.component.html",
})
export class BoardComponent {
    @Input({ required: true }) state!: string;
}
