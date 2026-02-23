import { TestBed } from "@angular/core/testing";
import { MenuComponent } from "./menu.component";

describe("MenuComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MenuComponent],
        }).compileComponents();
    });

    it("should not show any game creation or joining options by default", async () => {
        const fixture = TestBed.createComponent(MenuComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector("h3")?.textContent).toBeUndefined();
        expect(compiled.querySelector("form")).toBeNull();
    });

    it("should show game creation options when activated", async () => {
        const fixture = TestBed.createComponent(MenuComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        clickCreateGameButton(compiled);
        await fixture.whenStable();
        // Check that the "Create a New Game" options are now visible
        expect(compiled.querySelector("h3")?.textContent).toBe(
            "Create a New Game",
        );
        expect(compiled.querySelector("form")).not.toBeNull();
    });

    it("should show game joining options when activated", async () => {
        const fixture = TestBed.createComponent(MenuComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        clickJoinGameButton(compiled);
        await fixture.whenStable();
        expect(compiled.querySelector("h3")?.textContent).toBe(
            "Join an Existing Game",
        );
        expect(compiled.querySelector("form")).not.toBeNull();
    });

    it("should submit create game form with valid input", async () => {
        const fixture = TestBed.createComponent(MenuComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        clickCreateGameButton(compiled);
        await fixture.whenStable();
        // Submit the create game form with valid input
        const usernameInput = compiled.querySelector(
            "form input[id='username']",
        ) as HTMLInputElement;
        usernameInput.value = "TestUser";
        const submitButton = compiled.querySelector(
            "form button[type='submit']",
        ) as HTMLButtonElement;
        submitButton.click();
        await fixture.whenStable();
        // Check that the form submission logic was executed (e.g., by checking console logs or component state)
        const errorMessage = compiled.querySelector(".error");
        expect(errorMessage).toBeNull();
    });

    it("should submit join game form with valid input", async () => {
        const fixture = TestBed.createComponent(MenuComponent);
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        clickJoinGameButton(compiled);
        await fixture.whenStable();
        // Submit the create game form with valid input
        const usernameInput = compiled.querySelector(
            "form input[id='username']",
        ) as HTMLInputElement;
        usernameInput.value = "TestUser";
        const gamecodeInput = compiled.querySelector(
            "form input[id='gamecode']",
        ) as HTMLInputElement;
        gamecodeInput.value = "TEST123";
        const submitButton = compiled.querySelector(
            "form button[type='submit']",
        ) as HTMLButtonElement;
        submitButton.click();
        await fixture.whenStable();
        // Check that the form submission logic was executed (e.g., by checking console logs or component state)
        const errorMessage = compiled.querySelector(".error");
        expect(errorMessage).toBeNull();
    });
});

function clickCreateGameButton(compiled: HTMLElement) {
    const createButton = compiled.querySelector(
        "button:nth-of-type(1)",
    ) as HTMLButtonElement;
    createButton.click();
}

function clickJoinGameButton(compiled: HTMLElement) {
    const joinButton = compiled.querySelector(
        "button:nth-of-type(2)",
    ) as HTMLButtonElement;
    joinButton.click();
}
