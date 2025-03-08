import Game from "./index.ts";

export default class SideBetsMenu {
    game: Game;
    sideBetsModal: HTMLDialogElement;
    openSideBetsBtn: HTMLButtonElement;
    closeSideBetsBtn: HTMLButtonElement;
    activeBetsText: HTMLParagraphElement;
    lowMoneyText: HTMLParagraphElement;
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
                this.lowMoneyText.classList.add("hidden");
            }
        });
        this.openSideBetsBtn = <HTMLButtonElement>(
            document.getElementById("side-bets-button")
        );
        this.openSideBetsBtn.addEventListener("click", () => {
            this.adjustAvailableBets();
            this.sideBetsModal.showModal();
        });
        this.closeSideBetsBtn = <HTMLButtonElement>(
            document.getElementById("close-side-bets-button")
        );
        this.closeSideBetsBtn.addEventListener("click", () => {
            this.sideBetsModal.close();
            this.activeBetsText.classList.add("hidden");
            this.lowMoneyText.classList.add("hidden");
        });
        this.activeBetsText = <HTMLParagraphElement>(
            document.getElementById("active-side-bets-text")
        );
        this.lowMoneyText = <HTMLParagraphElement>(
            document.getElementById("side-bets-low-money-text")
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
            this.setSideBetOne();
        });
        this.sideBet5Btn = <HTMLButtonElement>(
            document.getElementById("side-bet-five")
        );
        this.sideBet5Btn.addEventListener("click", () => {
            this.setSideBetFive();
        });
        this.sideBet10Btn = <HTMLButtonElement>(
            document.getElementById("side-bet-ten")
        );
        this.sideBet10Btn.addEventListener("click", () => {
            this.setSideBetTen();
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
        const playerMoney = this.game.player.money;
        this.sideBetAmount = 0;
        this.sideBetOffBtn.disabled = true;
        this.sideBet1Btn.disabled = playerMoney < 1;
        this.sideBet5Btn.disabled = playerMoney < 5;
        this.sideBet10Btn.disabled = playerMoney < 10;
        localStorage.setItem(
            "side-bet-amount-setting",
            this.sideBetAmount.toString(10)
        );
    }
    setSideBetOne() {
        const playerMoney = this.game.player.money;
        this.sideBetAmount = 1;
        this.sideBetOffBtn.disabled = false;
        this.sideBet1Btn.disabled = true;
        this.sideBet5Btn.disabled = playerMoney < 5;
        this.sideBet10Btn.disabled = playerMoney < 10;
        localStorage.setItem(
            "side-bet-amount-setting",
            this.sideBetAmount.toString(10)
        );
    }
    setSideBetFive() {
        const playerMoney = this.game.player.money;
        this.sideBetAmount = 5;
        this.sideBetOffBtn.disabled = false;
        this.sideBet1Btn.disabled = playerMoney < 1;
        this.sideBet5Btn.disabled = true;
        this.sideBet10Btn.disabled = playerMoney < 10;
        localStorage.setItem(
            "side-bet-amount-setting",
            this.sideBetAmount.toString(10)
        );
    }
    setSideBetTen() {
        const playerMoney = this.game.player.money;
        this.sideBetAmount = 10;
        this.sideBetOffBtn.disabled = false;
        this.sideBet1Btn.disabled = playerMoney < 1;
        this.sideBet5Btn.disabled = playerMoney < 5;
        this.sideBet10Btn.disabled = true;
        localStorage.setItem(
            "side-bet-amount-setting",
            this.sideBetAmount.toString(10)
        );
    }
    adjustAvailableBets() {
        const playerMoney = this.game.player.money;
        this.sideBet1Btn.disabled = this.sideBetAmount === 1 || playerMoney < 1;
        this.sideBet5Btn.disabled = this.sideBetAmount === 5 || playerMoney < 5;
        this.sideBet10Btn.disabled =
            this.sideBetAmount === 10 || playerMoney < 10;
    }
}
