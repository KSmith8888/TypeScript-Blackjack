import Game from "./index.js";
import Card from "./card.js";

export default class Player {
    hand: Card[];
    splitHand: Card[];
    total: number;
    money: number;
    currentBet: number;
    aceOverage: number;
    cardElements: HTMLElement[];
    game: Game;
    constructor(game: Game) {
        this.hand = [];
        this.splitHand = [];
        this.total = 0;
        this.money = 100;
        this.currentBet = 0;
        this.aceOverage = 0;
        this.cardElements = [];
        this.game = game;
    }
    bet(amount: number): void {
        this.currentBet = amount;
        this.money -= amount;
        this.game.table.disableBets();
        this.game.table.totalMoneyText.textContent = this.money.toString();
        this.game.table.activateSelections(this.money, this.currentBet);
        this.game.startNewGame();
    }
}
