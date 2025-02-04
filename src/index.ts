import Player from "./player.js";
import Dealer from "./dealer.js";
import Deck from "./deck.js";
import Hand from "./hand.js";
import Table from "./table.js";

import "../assets/styles/index.css";

export default class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    table: Table;
    isFinalHand: boolean;
    highScore: number;
    numberOfDecks: number;
    shoePenetration: number;
    hitOnSoft17: boolean;
    isSoundMuted: boolean;
    constructor() {
        this.deck = new Deck(this);
        this.player = new Player(this);
        this.dealer = new Dealer(this);
        this.table = new Table(this);
        this.isFinalHand = true;
        this.highScore = 100;
        this.numberOfDecks = 4;
        this.shoePenetration = Math.floor((this.numberOfDecks * 52) / 4);
        this.hitOnSoft17 = false;
        this.isSoundMuted = true;
        this.#checkSavedHighScore();
    }
    startRound() {
        this.deck.playCardSound();
        setTimeout(() => {
            const initHand = new Hand();
            this.player.hands.push(initHand);
            this.player.drawCard();
            this.player.drawCard();
            this.dealer.drawCard(false);
            this.dealer.drawCard(true);
            this.table.dealerSection.append(this.table.dealerFaceDownCard);
            this.table.dealerFaceDownCard.style.display = "block";
            this.table.dealerScoreText.textContent = "??";
        }, 500);
        setTimeout(() => {
            this.#initHandCheck();
        }, 500);
    }
    #initHandCheck() {
        if (this.player.hands[this.player.currentHand].total === 21) {
            if (this.dealer.total !== 21) {
                this.player.hands[this.player.currentHand].result = "Won";
                this.player.hands[this.player.currentHand].resultText =
                    "BlackJack, well done!";
                this.endRound();
            } else {
                this.player.hands[this.player.currentHand].result = "Push";
                this.player.hands[this.player.currentHand].resultText =
                    "Push. Try again?";
                this.endRound();
            }
        } else if (this.dealer.total === 21) {
            this.player.hands[this.player.currentHand].result = "Lost";
            this.player.hands[this.player.currentHand].resultText =
                "Dealer got BlackJack, better luck next time!";
            this.endRound();
        } else {
            const initHand = this.player.hands[0];
            const canHit =
                this.player.hands[this.player.currentHand].total < 21;
            const canDouble = this.player.money >= this.player.currentBet;
            const canSplit =
                canDouble && initHand.cards[0].rank === initHand.cards[1].rank;
            this.table.activateSelections(canHit, canDouble, canSplit);
        }
    }
    #payout() {
        this.player.hands.forEach((hand) => {
            const bet = this.player.currentBet;
            const result =
                hand.result || this.#getResult(hand.total, this.dealer.total);
            if (result === "Won") {
                if (hand.hasBeenDoubled) this.player.money += bet * 4;
                else this.player.money += bet * 2;
            } else if (result === "Push") this.player.money += bet;
        });
        if (this.player.money > 0) {
            this.table.newGameButton.textContent = "Start New Game";
        } else {
            this.table.newGameButton.textContent = "New Hand";
            this.player.money = 100;
        }
    }
    getRankValue(rank: string | number, total: number) {
        const numbericValue = typeof rank === "number" ? rank : 0;
        if (rank === "A") {
            if (total + 11 > 21) {
                return { value: 1, aceOverage: false };
            } else {
                return { value: 11, aceOverage: true };
            }
        } else if (rank === "K" || rank === "Q" || rank === "J") {
            return { value: 10, aceOverage: false };
        } else {
            return { value: numbericValue, aceOverage: false };
        }
    }
    resetBoard() {
        this.isFinalHand = true;
        this.dealer.total = 0;
        this.dealer.holeCardRevealed = false;
        this.dealer.hand = [];
        this.dealer.aceOverage = 0;
        this.player.currentBet = 0;
        this.player.currentHand = 0;
        this.player.hands = [];
        this.player.cardElements = [];
        this.table.dealerSection.replaceChildren();
        this.table.playerSection.replaceChildren();
        this.table.splitSection.replaceChildren();
        this.table.gameResultText.textContent = "";
        this.table.playerScoreText.textContent = "0";
        this.table.dealerScoreText.textContent = "0";
        this.table.dealerFaceDownCard.style.display = "none";
        this.table.activateBets(this.player.money);
    }
    nextHand() {
        this.player.currentHand += 1;
        this.isFinalHand =
            this.player.hands.length === this.player.currentHand + 1;
        this.deck.playCardSound();
        setTimeout(() => {
            this.player.drawCard();
            const canHit =
                this.player.hands[this.player.currentHand].total < 21;
            const canDouble = this.player.money >= this.player.currentBet;
            this.table.activateSelections(canHit, canDouble, false);
        }, 500);
        const currentHand = this.player.hands[this.player.currentHand];
        const splitCard = currentHand.cards[0];
        const rankResult = this.getRankValue(splitCard.rank, currentHand.total);
        currentHand.total += rankResult.value;
        this.table.playerScoreText.textContent = currentHand.total.toString();
        this.table.newGameButton.style.display = "inline-block";
        this.table.nextHandBtn.style.display = "none";
    }
    #getResult(playerTotal: number, dealerTotal: number) {
        if (playerTotal > 21) {
            return "Lost";
        } else if (dealerTotal > 21) {
            return "Won";
        } else {
            if (playerTotal > dealerTotal) {
                return "Won";
            } else if (playerTotal === dealerTotal) {
                return "Push";
            } else {
                return "Lost";
            }
        }
    }
    #getUnknownResults() {
        this.player.hands.forEach((hand) => {
            if (!hand.result) {
                const result = this.#getResult(hand.total, this.dealer.total);
                hand.result = result;
                let resultText = "You win, well done!";
                if (result === "Lost")
                    resultText = "You lose, better luck next time!";
                else if (result === "Push") resultText = "Push. Try again?";
                hand.resultText = resultText;
            }
        });
    }
    showResultText() {
        if (this.player.hands.length === 1 || !this.isFinalHand) {
            this.table.gameResultText.textContent =
                this.player.hands[this.player.currentHand].resultText;
        } else {
            let won = 0;
            let lost = 0;
            let push = 0;
            this.player.hands.forEach((hand) => {
                if (hand.result === "Won") won += 1;
                else if (hand.result === "Lost") lost += 1;
                else push += 1;
            });
            this.table.gameResultText.textContent = `Result: Won: ${won.toString(
                10
            )} Lost: ${lost.toString(10)} Push: ${push.toString(10)}`;
        }
        this.table.resetModal.showModal();
    }
    endRound() {
        if (!this.dealer.holeCardRevealed) {
            this.dealer.revealHoleCard();
        }
        this.table.disableSelections();
        this.table.disableBets();
        this.#getUnknownResults();
        this.#payout();
        this.table.totalMoneyText.textContent = this.player.money.toString(10);
        this.#determineHighScore();
        this.showResultText();
    }
    #checkSavedHighScore() {
        const savedScore = localStorage.getItem("high-score");
        if (
            savedScore &&
            typeof parseInt(savedScore, 10) === "number" &&
            parseInt(savedScore, 10) > this.highScore
        ) {
            this.highScore = parseInt(savedScore, 10);
            localStorage.setItem("high-score", this.highScore.toString(10));
            this.table.topPayout.textContent = this.highScore.toString(10);
        }
    }
    #determineHighScore() {
        if (this.player.money > this.highScore) {
            this.highScore = this.player.money;
            localStorage.setItem("high-score", this.player.money.toString(10));
            this.table.topPayout.textContent = this.player.money.toString(10);
        }
    }
}

const game = new Game();
game.table.disableSelections();
