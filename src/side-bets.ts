import Game from "./index.ts";

export default class SideBets {
    game: Game;
    sideBetsModal: HTMLDialogElement;
    openSideBetsBtn: HTMLButtonElement;
    closeSideBetsBtn: HTMLButtonElement;
    currentBetsList: HTMLElement;
    constructor(game: Game) {
        this.game = game;
        this.sideBetsModal = <HTMLDialogElement>(
            document.getElementById("side-bets-modal")
        );
        this.openSideBetsBtn = <HTMLButtonElement>(
            document.getElementById("side-bets-button")
        );
        this.openSideBetsBtn.addEventListener("click", () => {
            this.sideBetsModal.showModal();
        });
        this.closeSideBetsBtn = <HTMLButtonElement>(
            document.getElementById("close-side-bets-button")
        );
        this.closeSideBetsBtn.addEventListener("click", () => {
            this.sideBetsModal.close();
        });
        this.currentBetsList = <HTMLElement>(
            document.getElementById("current-side-bets-list")
        );
    }
}
