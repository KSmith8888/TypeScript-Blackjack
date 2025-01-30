import Player from "./player.js";
import Dealer from "./dealer.js";
import Deck from "./deck.js";
import Hand from "./hand.js";
import Table from "./table.js";

import cardAudioSrc from "../assets/audio/deal-card-sound.wav";
import shuffleAudioSrc from "../assets/audio/cardShuffle.wav";
import "../assets/styles/index.css";

export default class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    table: Table;
    highScore: number;
    numberOfDecks: number;
    isSoundMuted: boolean;
    dealCardSound: HTMLAudioElement;
    shuffleSound: HTMLAudioElement;
    constructor() {
        this.deck = new Deck();
        this.player = new Player(this);
        this.dealer = new Dealer(this);
        this.table = new Table(this);
        this.highScore = 100;
        this.numberOfDecks = 4;
        this.isSoundMuted = false;
        this.dealCardSound = new Audio(cardAudioSrc);
        this.dealCardSound.volume = 0.5;
        this.shuffleSound = new Audio(shuffleAudioSrc);
        this.shuffleSound.volume = 0.5;
    }
    startNewGame() {
        this.playCardSound();
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
            this.initHandCheck();
        }, 500);
    }
    playCardSound() {
        if (!this.isSoundMuted) {
            this.dealCardSound.play().catch((err) => {
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
        }
    }
    playShuffleSound() {
        if (!this.isSoundMuted) {
            this.shuffleSound.play().catch((err) => {
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
        }
    }
    initHandCheck() {
        if (this.player.hands[this.player.currentHand].total === 21) {
            if (this.dealer.total !== 21) {
                this.player.hands[this.player.currentHand].result = "Won";
                this.showResultText("BlackJack, well done!");
                this.endGame();
            } else {
                this.player.hands[this.player.currentHand].result = "Push";
                this.dealer.revealHoleCard();
                this.showResultText("Push. Try again?");
                this.endGame();
            }
        } else if (this.dealer.total === 21) {
            this.player.hands[this.player.currentHand].result = "Lost";
            this.dealer.revealHoleCard();
            this.showResultText("Dealer got BlackJack, better luck next time!");
            this.endGame();
        } else {
            const initHand = this.player.hands[0];
            const canSplit = initHand.cards[0].rank === initHand.cards[1].rank;
            this.table.activateSelections(
                this.player.hands[this.player.currentHand].total,
                this.player.money,
                this.player.currentBet,
                true,
                canSplit
            );
        }
    }
    payout() {
        this.player.hands.forEach((hand) => {
            const bet = this.player.currentBet;
            const result =
                hand.result || this.getResult(hand.total, this.dealer.total);
            if (result === "Won") {
                if (hand.hasBeenDoubled) this.player.money += bet * 4;
                else this.player.money += bet * 2;
            } else if (result === "Push") this.player.money += bet;
        });
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
        this.dealer.total = 0;
        this.player.currentBet = 0;
        this.dealer.aceOverage = 0;
        this.player.currentHand = 0;
        this.player.hands = [];
        this.dealer.hand = [];
        this.player.cardElements = [];
        this.table.dealerSection.replaceChildren();
        this.table.playerSection.replaceChildren();
        this.table.splitSection.replaceChildren();
        this.table.gameResultText.textContent = "";
        this.table.playerScoreText.textContent = "0";
        this.table.dealerScoreText.textContent = "0";
        this.table.dealerFaceDownCard.style.display = "none";
        this.table.resetModal.close();
        this.table.activateBets(this.player.money);
        this.table.bet5Btn.focus();
    }
    resetSplit() {
        this.player.currentHand += 1;
        setTimeout(() => {
            this.playCardSound();
            this.player.drawCard();
        }, 500);
        this.table.activateSelections(
            this.player.hands[this.player.currentHand].total,
            this.player.money,
            this.player.currentBet,
            true,
            false
        );
        this.table.newGameButton.style.display = "inline-block";
        this.table.completeSplitBtn.style.display = "none";
        const currentHand = this.player.hands[this.player.currentHand];
        const splitCard = currentHand.cards[0];
        const rankResult = this.getRankValue(splitCard.rank, currentHand.total);
        currentHand.total += rankResult.value;
        this.table.playerScoreText.textContent = currentHand.total.toString();
    }
    shuffleCards() {
        this.deck.cards = [];
        this.playShuffleSound();
        if (this.numberOfDecks >= 1 && this.numberOfDecks < 9) {
            for (let i = 0; i < this.numberOfDecks; i++) {
                this.deck.generateDeck();
            }
        } else {
            this.numberOfDecks = 1;
            this.deck.generateDeck();
        }
    }
    updateShoe() {
        this.table.shoeMeter.value = this.deck.cards.length;
        this.table.shoeMeter.textContent = this.deck.cards.length.toString(10);
        this.table.cardsRemaining.textContent =
            this.deck.cards.length.toString(10);
    }
    getResult(playerTotal: number, dealerTotal: number) {
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
    showResultText(result: string) {
        if (result === "Won") {
            this.table.gameResultText.textContent = "You win, well done!";
        } else if (result === "Push") {
            this.table.gameResultText.textContent = "Push. Try again?";
        } else if (result === "Lost") {
            const isRoundComplete =
                this.player.hands.length === 1 ||
                this.player.hands.length === this.player.currentHand + 1;
            if (this.player.money <= 0 && isRoundComplete) {
                this.table.gameResultText.textContent =
                    "Game over, you ran out of money! Restart with $100?";
            } else {
                this.table.gameResultText.textContent =
                    "You lose, better luck next time!";
            }
        } else {
            this.table.gameResultText.textContent = result;
        }
        this.table.resetModal.showModal();
    }
    endGame() {
        this.table.disableSelections();
        this.table.disableBets();
        this.determineHighScore();
        this.payout();
        if (this.player.money > 0) {
            this.table.newGameButton.textContent = "Start New Game";
        } else {
            this.table.newGameButton.textContent = "New Hand";
            this.player.money = 100;
        }
        this.table.totalMoneyText.textContent = this.player.money.toString();
    }
    checkSavedHighScore() {
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
    determineHighScore() {
        if (this.player.money > this.highScore) {
            this.highScore = this.player.money;
            localStorage.setItem("high-score", this.player.money.toString(10));
            this.table.topPayout.textContent = this.player.money.toString(10);
        }
    }
}

const game = new Game();
game.table.disableSelections();
game.checkSavedHighScore();
