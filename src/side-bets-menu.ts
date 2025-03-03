import Game from "./index.ts";

export default class SideBetsMenu {
    game: Game;
    sideBetsModal: HTMLDialogElement;
    openSideBetsBtn: HTMLButtonElement;
    closeSideBetsBtn: HTMLButtonElement;
    activeBetsText: HTMLParagraphElement;
    currentBetsList: HTMLElement;
    sideBetAmount: number;
    sideBetOffBtn: HTMLButtonElement;
    sideBet1Btn: HTMLButtonElement;
    sideBet5Btn: HTMLButtonElement;
    sideBet10Btn: HTMLButtonElement;
    constructor(game: Game) {
        this.game = game;
        this.sideBetsModal = <HTMLDialogElement>(
            document.getElementById("side-bets-modal")
        );
        this.sideBetsModal.addEventListener("click", (e) => {
            if (e.target === e.currentTarget) {
                this.sideBetsModal.close();
                this.activeBetsText.classList.add("hidden");
            }
        });
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
            this.activeBetsText.classList.add("hidden");
        });
        this.activeBetsText = <HTMLParagraphElement>(
            document.getElementById("active-side-bets-text")
        );
        this.currentBetsList = <HTMLElement>(
            document.getElementById("current-side-bets-list")
        );
        this.sideBetAmount = 0;
        this.sideBetOffBtn = <HTMLButtonElement>(
            document.getElementById("side-bet-off")
        );
        this.sideBetOffBtn.addEventListener("click", () => {
            this.turnOffSideBets();
        });
        this.sideBet1Btn = <HTMLButtonElement>(
            document.getElementById("side-bet-one")
        );
        this.sideBet1Btn.addEventListener("click", () => {
            this.sideBetAmount = 1;
            this.sideBetOffBtn.disabled = false;
            this.sideBet1Btn.disabled = true;
            this.sideBet5Btn.disabled = false;
            this.sideBet10Btn.disabled = false;
            localStorage.setItem(
                "side-bet-amount-setting",
                this.sideBetAmount.toString(10)
            );
        });
        this.sideBet5Btn = <HTMLButtonElement>(
            document.getElementById("side-bet-five")
        );
        this.sideBet5Btn.addEventListener("click", () => {
            this.sideBetAmount = 5;
            this.sideBetOffBtn.disabled = false;
            this.sideBet1Btn.disabled = false;
            this.sideBet5Btn.disabled = true;
            this.sideBet10Btn.disabled = false;
            localStorage.setItem(
                "side-bet-amount-setting",
                this.sideBetAmount.toString(10)
            );
        });
        this.sideBet10Btn = <HTMLButtonElement>(
            document.getElementById("side-bet-ten")
        );
        this.sideBet10Btn.addEventListener("click", () => {
            this.sideBetAmount = 10;
            this.sideBetOffBtn.disabled = false;
            this.sideBet1Btn.disabled = false;
            this.sideBet5Btn.disabled = false;
            this.sideBet10Btn.disabled = true;
            localStorage.setItem(
                "side-bet-amount-setting",
                this.sideBetAmount.toString(10)
            );
        });
    }
    checkSavedSetting() {
        const sideBetAmount = localStorage.getItem("side-bet-amount-setting");
        if (sideBetAmount) {
            const sideBetNum = parseInt(sideBetAmount, 10);
            if (sideBetNum === 1) {
                this.sideBetAmount = 1;
                this.sideBet1Btn.disabled = true;
            } else if (sideBetNum === 5) {
                this.sideBetAmount = 5;
                this.sideBet5Btn.disabled = true;
            } else if (sideBetNum === 10) {
                this.sideBetAmount = 10;
                this.sideBet10Btn.disabled = true;
            } else {
                this.sideBetAmount = 0;
                this.sideBetOffBtn.disabled = true;
            }
        } else {
            this.sideBetOffBtn.disabled = true;
        }
    }
    turnOffSideBets() {
        this.sideBetAmount = 0;
        this.sideBetOffBtn.disabled = true;
        this.sideBet1Btn.disabled = false;
        this.sideBet5Btn.disabled = false;
        this.sideBet10Btn.disabled = false;
        localStorage.setItem(
            "side-bet-amount-setting",
            this.sideBetAmount.toString(10)
        );
    }
}
