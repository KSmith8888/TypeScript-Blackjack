import Game from "./index.js";
import Hand from "./hand.js";

export default class Player {
    hands: Hand[];
    currentHand: number;
    money: number;
    currentBet: number;
    cardElements: HTMLElement[];
    game: Game;
    constructor(game: Game) {
        this.hands = [];
        this.currentHand = 0;
        this.money = 100;
        this.currentBet = 0;
        this.cardElements = [];
        this.game = game;
    }
    bet(amount: number): void {
        this.currentBet = amount;
        this.money -= amount;
        this.game.table.disableBets();
        this.game.table.totalMoneyText.textContent = this.money.toString();
        this.game.startRound();
    }
    drawCard() {
        if (this.game.deck.cards.length < 10) {
            this.game.shuffleCards();
        }
        const index = this.game.deck.getCardIndex();
        const newCard = this.game.deck.cards[index];
        this.game.table.renderCard("Player", newCard.rank, newCard.suit);
        this.game.deck.cards.splice(index, 1);
        this.game.updateShoe();
        const currentHand = this.hands[this.currentHand];
        currentHand.cards.push(newCard);
        const result = this.game.getRankValue(newCard.rank, currentHand.total);
        currentHand.total += result.value;
        if (result.aceOverage) {
            currentHand.aceOverage += 10;
        }
        let didBust = false;
        if (currentHand.total > 21) {
            if (currentHand.aceOverage > 0) {
                currentHand.aceOverage -= 10;
                currentHand.total -= 10;
            } else {
                didBust = true;
            }
        }
        if (didBust) {
            this.hands[this.currentHand].result = "Lost";
            this.game.table.playerScoreText.textContent =
                currentHand.total.toString();
            this.hands[this.currentHand].resultText =
                "You busted. Better luck next time";
            if (this.game.isFinalHand) {
                this.game.endRound();
            } else {
                this.game.showResultText();
            }
        }
    }
    hit() {
        this.game.playCardSound();
        const canHit = this.hands[this.currentHand].total < 21;
        setTimeout(() => {
            this.drawCard();
            this.game.table.activateSelections(canHit, false, false);
        }, 750);
    }
    stay() {
        if (this.game.isFinalHand) {
            setTimeout(() => {
                this.game.dealer.revealHoleCard();
                this.game.dealer.startTurn();
            }, 750);
        } else {
            this.game.nextHand();
        }
    }
    double() {
        this.game.playCardSound();
        setTimeout(() => {
            this.money -= this.currentBet;
            this.hands[this.currentHand].hasBeenDoubled = true;
            this.game.table.totalMoneyText.textContent = this.money.toString();
            this.drawCard();
            if (this.game.isFinalHand && !this.hands[this.currentHand].result) {
                this.game.dealer.revealHoleCard();
                this.game.dealer.startTurn();
            }
        }, 750);
    }
    split() {
        this.game.isFinalHand = false;
        const splitCard = this.hands[this.currentHand].cards.pop();
        if (splitCard) {
            this.game.table.splitSection.append(
                this.cardElements[this.currentHand + 1]
            );
            const splitHand = new Hand();
            this.hands.push(splitHand);
            splitHand.cards.push(splitCard);
            if (typeof splitCard.rank === "string") {
                if (splitCard.rank === "A") {
                    this.hands[this.currentHand].total -= 1;
                } else {
                    this.hands[this.currentHand].total -= 10;
                }
            } else {
                this.hands[this.currentHand].total -= splitCard.rank;
            }
            this.money -= this.currentBet;
            this.game.table.playerScoreText.textContent =
                splitHand.total.toString();
            this.game.table.totalMoneyText.textContent = this.money.toString();
            this.game.table.newGameButton.style.display = "none";
            this.game.table.nextHandBtn.style.display = "inline-block";
            this.game.table.disableBets();
            this.game.playCardSound();
            setTimeout(() => {
                this.drawCard();
                const canHit = this.hands[this.currentHand].total < 21;
                const canDouble = this.money >= this.currentBet;
                this.game.table.activateSelections(canHit, canDouble, false);
            }, 500);
        }
    }
}
