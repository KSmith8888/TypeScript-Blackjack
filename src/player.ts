import Game from "./index.ts";
import Hand from "./hand.ts";

export default class Player {
    hands: Hand[];
    currentHand: number;
    money: number;
    currentBet: number;
    cardElements: HTMLElement[];
    hasInsurance: boolean;
    game: Game;
    constructor(game: Game) {
        this.hands = [];
        this.currentHand = 0;
        this.money = 100;
        this.currentBet = 0;
        this.cardElements = [];
        this.hasInsurance = false;
        this.game = game;
    }
    bet(amount: number) {
        this.currentBet = amount;
        this.money -= amount;
        this.game.table.disableBets();
        this.game.table.totalMoneyText.textContent = `$${this.money.toString()}`;
        this.game.startRound();
    }
    drawCard() {
        const index = this.game.deck.getCardIndex();
        const newCard = this.game.deck.cards[index];
        this.game.table.renderCard("Player", newCard.rank, newCard.suit);
        this.game.deck.cards.splice(index, 1);
        this.game.deck.updateShoe();
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
        this.game.table.playerScoreText.textContent =
            currentHand.total.toString();
        return didBust;
    }
    busted() {
        this.hands[this.currentHand].result = "Lost";
        this.hands[this.currentHand].resultText =
            "You busted. Better luck next time";
        if (this.hands.length === 1) {
            this.game.endRound();
        } else if (this.game.isFinalHand) {
            let unfinishedHands = 0;
            this.hands.forEach((hand) => {
                if (!hand.result) unfinishedHands += 1;
            });
            if (unfinishedHands > 0) {
                this.game.dealer.revealHoleCard();
                this.game.dealer.startTurn();
            } else {
                this.game.endRound();
            }
        } else {
            this.game.showResultText();
        }
    }
    hit() {
        this.game.table.surrenderButton.disabled = true;
        this.game.deck.playCardSound();
        setTimeout(() => {
            const didBust = this.drawCard();
            if (!didBust) {
                const canHit = this.hands[this.currentHand].total < 21;
                this.game.table.activateSelections(canHit, false, false);
            } else {
                this.busted();
            }
        }, this.game.settings.drawDelay);
    }
    stay() {
        this.game.table.surrenderButton.disabled = true;
        this.game.table.disableSelections();
        if (this.game.isFinalHand) {
            this.game.dealer.revealHoleCard();
            setTimeout(() => {
                this.game.dealer.startTurn();
            }, this.game.settings.drawDelay);
        } else {
            this.game.nextHand();
        }
    }
    double() {
        this.game.table.surrenderButton.disabled = true;
        this.game.deck.playCardSound();
        setTimeout(() => {
            this.money -= this.currentBet;
            this.hands[this.currentHand].hasBeenDoubled = true;
            this.game.table.totalMoneyText.textContent = `$${this.money.toString()}`;
            const didBust = this.drawCard();
            if (!didBust) {
                if (
                    this.game.isFinalHand &&
                    !this.hands[this.currentHand].result
                ) {
                    this.game.dealer.revealHoleCard();
                    this.game.dealer.startTurn();
                } else {
                    this.game.nextHand();
                }
            } else {
                this.busted();
            }
        }, this.game.settings.drawDelay);
    }
    split() {
        this.game.table.surrenderButton.disabled = true;
        this.game.isFinalHand = false;
        const splitCard = this.hands[this.currentHand].cards.pop();
        if (splitCard) {
            this.game.table.splitSection.append(
                this.cardElements[this.currentHand + 1]
            );
            const currentHand = this.hands[this.currentHand];
            const splitHand = new Hand();
            this.hands.push(splitHand);
            splitHand.cards.push(splitCard);
            if (typeof splitCard.rank === "string") {
                if (splitCard.rank === "A") {
                    currentHand.total -= 1;
                    splitHand.aceOverage = 10;
                } else {
                    currentHand.total -= 10;
                }
            } else {
                currentHand.total -= splitCard.rank;
            }
            this.money -= this.currentBet;
            this.game.table.playerScoreText.textContent =
                splitHand.total.toString();
            this.game.table.totalMoneyText.textContent = `$${this.money.toString()}`;
            this.game.table.newGameButton.style.display = "none";
            this.game.table.nextHandBtn.style.display = "inline-block";
            this.game.deck.playCardSound();
            setTimeout(() => {
                this.drawCard();
                const canHit = currentHand.total < 21;
                const canDouble = canHit && this.money >= this.currentBet;
                if (
                    currentHand.cards[0].rank !== "A" ||
                    this.game.settings.hitOnSplitAces
                ) {
                    this.game.table.activateSelections(
                        canHit,
                        canDouble,
                        false
                    );
                } else {
                    this.game.table.activateSelections(false, false, false);
                }
            }, this.game.settings.drawDelay);
        }
    }
    surrender() {
        this.hands[this.currentHand].result = "Surrender";
        this.hands[this.currentHand].resultText =
            "Surrender. It could have been worse";
        this.game.endRound();
    }
}
