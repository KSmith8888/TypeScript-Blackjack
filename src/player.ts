import Game from "./index.js";
import Hand from "./hand.js";

export default class Player {
    hands: Hand[];
    currentHand: number;
    total: number;
    money: number;
    currentBet: number;
    aceOverage: number;
    cardElements: HTMLElement[];
    game: Game;
    constructor(game: Game) {
        this.hands = [];
        this.currentHand = 0;
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
        this.game.startNewGame();
    }
    hit() {
        this.game.playCardSound();
        setTimeout(() => {
            this.game.drawPlayer();
            this.game.table.activateSelections(
                this.money,
                this.currentBet,
                false,
                false
            );
        }, 750);
    }
    stay() {
        if (!this.game.isHandSplit) {
            setTimeout(() => {
                this.game.revealHoleCard();
            }, 750);
        } else {
            this.game.endGame(
                `First hand total: ${this.game.player.total.toString(10)}`
            );
        }
    }
    double() {
        this.game.playCardSound();
        setTimeout(() => {
            this.money -= this.currentBet;
            this.hands[this.currentHand].hasBeenDoubled = true;
            this.game.table.totalMoneyText.textContent = this.money.toString();
            this.game.drawPlayer();
            if (this.total <= 21) {
                this.game.revealHoleCard();
            }
        }, 750);
    }
    split() {
        const splitCard = this.hands[0].cards.pop();
        if (splitCard) {
            this.game.isHandSplit = true;
            this.game.table.splitSection.append(this.cardElements[1]);
            const secondHand = new Hand(this.currentBet);
            this.hands.push(secondHand);
            secondHand.cards.push(splitCard);
            if (typeof splitCard.rank === "string") {
                if (splitCard.rank === "A") {
                    this.total -= 1;
                } else {
                    this.total -= 10;
                }
            } else {
                this.total -= splitCard.rank;
            }
            this.money -= this.currentBet;
            this.game.table.playerScoreText.textContent = this.total.toString();
            this.game.table.totalMoneyText.textContent = this.money.toString();
            this.game.table.disableBets();
            this.game.playCardSound();
            setTimeout(() => {
                this.game.drawPlayer();
            }, 500);
            this.game.table.activateSelections(
                this.money,
                this.currentBet,
                true,
                false
            );
        }
    }
}
