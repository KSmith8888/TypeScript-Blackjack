import Player from "./player.js";
import Dealer from "./dealer.js";
import Deck from "./deck.js";
import Hand from "./hand.js";
import Table from "./table.js";

import cardAudioSrc from "../assets/audio/deal-card-sound.wav";
import "../assets/styles/index.css";

export default class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    table: Table;
    highScore: number;
    isHandSplit: boolean;
    numberOfDecks: number;
    initGameOver: boolean;
    isSoundMuted: boolean;
    dealCardSound: HTMLAudioElement;
    constructor() {
        this.deck = new Deck();
        this.player = new Player(this);
        this.dealer = new Dealer();
        this.table = new Table(this);
        this.highScore = 100;
        this.isHandSplit = false;
        this.numberOfDecks = 4;
        this.initGameOver = false;
        this.isSoundMuted = false;
        this.dealCardSound = new Audio(cardAudioSrc);
        this.dealCardSound.volume = 0.5;
    }
    startNewGame() {
        this.playCardSound();
        setTimeout(() => {
            const initHand = new Hand(this.player.currentBet);
            this.player.hands.push(initHand);
            this.drawPlayer();
            this.drawPlayer();
            this.drawDealer(false);
            this.drawDealer(true);
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
                console.error(err);
            });
        }
    }
    initHandCheck() {
        if (this.player.total === 21) {
            if (this.dealer.total !== 21) {
                this.initGameOver = true;
                this.endGame("BlackJack, well done!");
            } else {
                this.player.hands[this.player.currentHand].result = "Push";
                this.initGameOver = true;
                this.revealHoleCard();
                this.endGame("Push. Try again?");
            }
        } else if (this.dealer.total === 21) {
            this.player.hands[this.player.currentHand].result = "Lost";
            this.initGameOver = true;
            this.revealHoleCard();
            this.endGame("Dealer got BlackJack, better luck next time!");
        }
        const initHand = this.player.hands[0];
        const canSplit = initHand.cards[0].rank === initHand.cards[1].rank;
        this.table.activateSelections(
            this.player.money,
            this.player.currentBet,
            true,
            canSplit
        );
    }
    payout() {
        this.player.hands.forEach((hand) => {
            if (hand.result === "Won") {
                if (hand.hasBeenDoubled) this.player.money += hand.bet * 4;
                else this.player.money += hand.bet * 2;
            } else if (hand.result === "Push") this.player.money += hand.bet;
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
    revealHoleCard() {
        this.playCardSound();
        setTimeout(() => {
            this.table.dealerFaceDownCard.style.display = "none";
            const hiddenDealerCard = this.dealer.hand[1];
            if (hiddenDealerCard) {
                this.table.renderCard(
                    "Dealer",
                    hiddenDealerCard.rank,
                    hiddenDealerCard.suit
                );
                this.table.dealerScoreText.textContent =
                    this.dealer.total.toString();
            }
        }, 500);
        if (!this.initGameOver) {
            setTimeout(() => {
                this.initiateDealerTurn();
            }, 750);
        }
    }
    initiateDealerTurn() {
        const continueDrawing = setInterval(() => {
            if (this.dealer.total < 17) {
                this.playCardSound();
                this.drawDealer(false);
            } else {
                clearInterval(continueDrawing);
                this.checkTotals();
            }
        }, 1000);
    }
    resetBoard() {
        this.player.total = 0;
        this.dealer.total = 0;
        this.player.currentBet = 0;
        this.player.aceOverage = 0;
        this.dealer.aceOverage = 0;
        this.player.currentHand = 0;
        this.player.hands = [];
        this.dealer.hand = [];
        this.player.cardElements = [];
        this.isHandSplit = false;
        this.initGameOver = false;
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
        const splitCard = this.player.hands[this.player.currentHand].cards[0];
        if (typeof splitCard.rank === "string") {
            if (splitCard.rank === "A") {
                this.player.total = 11;
                this.player.aceOverage = 10;
            } else {
                this.player.total = 10;
                this.player.aceOverage = 0;
            }
        } else {
            this.player.total = splitCard.rank;
            this.player.aceOverage = 0;
        }
        this.table.playerScoreText.textContent = this.player.total.toString();
        this.table.resetModal.showModal();
    }
    fillShoe() {
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
    drawDealer(hidden: boolean) {
        if (this.deck.cards.length < 10) {
            this.fillShoe();
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        this.dealer.hand.push(newCard);
        const result = this.getRankValue(newCard.rank, this.dealer.total);
        this.dealer.total += result.value;
        if (result.aceOverage) this.dealer.aceOverage += 10;
        if (this.dealer.total > 21) {
            if (this.dealer.aceOverage > 0) {
                this.dealer.total -= 10;
                this.dealer.aceOverage -= 10;
            }
        }
        if (this.dealer.hand.length >= 3) {
            this.table.dealerScoreText.textContent =
                this.dealer.total.toString();
        }
        if (!hidden)
            this.table.renderCard("Dealer", newCard.rank, newCard.suit);
        this.deck.cards.splice(index, 1);
        this.updateShoe();
    }
    drawPlayer() {
        if (this.deck.cards.length < 10) {
            this.fillShoe();
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        this.player.hands[this.player.currentHand].cards.push(newCard);
        const result = this.getRankValue(newCard.rank, this.player.total);
        this.player.total += result.value;
        this.player.hands[this.player.currentHand].total += result.value;
        if (result.aceOverage) {
            this.player.aceOverage += 10;
            this.player.hands[this.player.currentHand].aceOverage += 10;
        }
        if (this.player.total > 21) {
            if (this.player.aceOverage > 0) {
                this.player.total -= 10;
                this.player.aceOverage -= 10;
                this.player.hands[this.player.currentHand].total -= 10;
                this.player.hands[this.player.currentHand].aceOverage -= 10;
            } else {
                this.checkTotals();
            }
        }
        this.table.playerScoreText.textContent = this.player.total.toString();
        this.table.renderCard("Player", newCard.rank, newCard.suit);
        this.deck.cards.splice(index, 1);
        this.updateShoe();
    }
    checkTotals() {
        if (this.player.total > 21) {
            this.player.hands[this.player.currentHand].result = "Lost";
            if (this.player.money > 0) {
                this.endGame("You lose, better luck next time!");
            } else {
                this.endGame(
                    "Game over, you ran out of money! Restart with $100?"
                );
            }
        } else if (this.dealer.total > 21) {
            this.player.hands[this.player.currentHand].result = "Won";
            this.endGame("You win, well done!");
        } else {
            if (this.player.total > this.dealer.total) {
                this.player.hands[this.player.currentHand].result = "Won";
                this.endGame("You win, well done!");
            } else if (this.player.total === this.dealer.total) {
                this.player.hands[this.player.currentHand].result = "Push";
                this.endGame("Push. Try again?");
            } else if (
                this.player.total < this.dealer.total &&
                this.player.money > 0
            ) {
                this.player.hands[this.player.currentHand].result = "Lost";
                this.endGame("You lose, better luck next time!");
            } else {
                this.player.hands[this.player.currentHand].result = "Lost";
                this.endGame(
                    "Game over, you ran out of money! Restart with $100?"
                );
            }
        }
    }
    endGame(resultText: string) {
        this.table.gameResultText.textContent = resultText;
        this.table.disableSelections();
        this.table.disableBets();
        this.determineHighScore();
        if (
            this.player.hands.length === 1 ||
            this.player.hands.length === this.player.currentHand + 1
        ) {
            this.payout();
            if (this.player.money > 0) {
                this.table.newGameButton.textContent = "Start New Game";
            } else {
                this.table.newGameButton.textContent = "New Hand";
                this.player.money = 100;
            }
        } else {
            this.table.newGameButton.style.display = "none";
            this.table.completeSplitBtn.style.display = "inline-block";
            this.resetSplit();
        }
        this.table.totalMoneyText.textContent = this.player.money.toString();
        this.table.resetModal.showModal();
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
