import { Game } from "./index.js";
import { Card } from "./card.js";

class Player {
    hand: Card[];
    total: number;
    cardElements: HTMLElement[];
    money: number;
    currentBet: number;
    aceOverage: number;
    bet5Btn: HTMLButtonElement;
    bet10Btn: HTMLButtonElement;
    bet25Btn: HTMLButtonElement;
    bet50Btn: HTMLButtonElement;
    totalMoneyText: HTMLSpanElement;
    game: Game;
    constructor(game: Game) {
        this.hand = [];
        this.cardElements = [];
        this.total = 0;
        this.money = 100;
        this.currentBet = 0;
        this.aceOverage = 0;
        this.totalMoneyText = <HTMLSpanElement>(
            document.querySelector("#total-money-text")
        );
        this.bet5Btn = <HTMLButtonElement>(
            document.querySelector("#bet-5-button")
        );
        this.bet10Btn = <HTMLButtonElement>(
            document.querySelector("#bet-10-button")
        );
        this.bet25Btn = <HTMLButtonElement>(
            document.querySelector("#bet-25-button")
        );
        this.bet50Btn = <HTMLButtonElement>(
            document.querySelector("#bet-50-button")
        );
        this.game = game;
        this.bet5Btn.addEventListener("click", () => {
            this.bet(5);
        });
        this.bet10Btn.addEventListener("click", () => {
            this.bet(10);
        });
        this.bet25Btn.addEventListener("click", () => {
            this.bet(25);
        });
        this.bet50Btn.addEventListener("click", () => {
            this.bet(50);
        });
    }
    bet(amount: number): void {
        if (this.money >= amount) {
            this.currentBet = amount;
            this.money -= amount;
            this.disableBets();
            this.game.activateSelections();
            this.game.startNewGame();
        }
    }
    disableBets(): void {
        this.bet5Btn.disabled = true;
        this.bet10Btn.disabled = true;
        this.bet25Btn.disabled = true;
        this.bet50Btn.disabled = true;
        this.totalMoneyText.textContent = this.money.toString();
    }
    activateBets(): void {
        if (this.money >= 5) this.bet5Btn.disabled = false;
        if (this.money >= 10) this.bet10Btn.disabled = false;
        if (this.money >= 25) this.bet25Btn.disabled = false;
        if (this.money >= 50) this.bet50Btn.disabled = false;
    }
}

export { Player };
