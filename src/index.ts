import Player from "./player.js";
import Dealer from "./dealer.js";
import Deck from "./deck.js";
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
    splitBet: number;
    dealCardSound: HTMLAudioElement;
    constructor() {
        this.deck = new Deck();
        this.player = new Player(this);
        this.dealer = new Dealer();
        this.table = new Table(this);
        this.highScore = 100;
        this.dealCardSound = new Audio(cardAudioSrc);
        this.isHandSplit = false;
        this.splitBet = 0;
        this.dealCardSound.volume = 0.5;
    }
    playerHit() {
        setTimeout(() => {
            this.dealCardSound.play().catch((err) => {
                console.error(err);
            });
            this.drawCard("Player");
            if (this.player.total <= 21) {
                this.table.hitButton.disabled = false;
                this.table.stayButton.disabled = false;
            }
        }, 750);
    }
    playerDouble() {
        setTimeout(() => {
            if (this.player.money >= this.player.currentBet) {
                this.dealCardSound.play().catch((err) => {
                    console.error(err);
                });
                this.player.money -= this.player.currentBet;
                this.player.currentBet = this.player.currentBet * 2;
                this.table.totalMoneyText.textContent =
                    this.player.money.toString();
                this.drawCard("Player");
                if (this.player.total <= 21) {
                    this.initiateDealerTurn();
                }
            }
        }, 750);
    }
    playerSplit() {
        const splitCard = this.player.hand.pop();
        if (this.player.money >= this.player.currentBet && splitCard) {
            this.isHandSplit = true;
            this.splitBet = this.player.currentBet;
            this.table.splitSection.append(this.player.cardElements[1]);
            this.player.splitHand.push(splitCard);
            if (typeof splitCard.rank === "string") {
                if (splitCard.rank === "A") {
                    this.player.total -= 1;
                } else {
                    this.player.total -= 10;
                }
            } else {
                this.player.total -= splitCard.rank;
            }
            this.player.money -= this.player.currentBet;
            this.table.playerScoreText.textContent =
                this.player.total.toString();
            this.table.totalMoneyText.textContent =
                this.player.money.toString();
            this.table.disableBets();
            setTimeout(() => {
                this.dealCardSound.play().catch((err) => {
                    console.error(err);
                });
                this.drawCard("Player");
            }, 500);
            this.table.activateSelections(
                this.player.money,
                this.player.currentBet
            );
        }
    }
    startNewGame() {
        setTimeout(() => {
            this.dealCardSound.play().catch((err) => {
                console.error(err);
            });
            this.drawCard("Player");
            this.drawCard("Player");
            this.drawCard("Dealer");
            if (this.player.hand[0].rank === this.player.hand[1].rank) {
                this.table.splitButton.disabled = false;
            }
            this.table.dealerSection.append(this.table.dealerFaceDownCard);
            this.table.dealerFaceDownCard.style.display = "block";
        }, 500);
    }
    getRankValue(rank: string | number, currentTurn: Player | Dealer) {
        /*
        If the rank is 2-10, add the rank to the total. If the rank is Jack, Queen, or King add 10. If the rank is Ace and adding 11 would bust, then add 1, otherwise add 11
        */
        const numericValueRank = typeof rank === "number" ? rank : 0;
        switch (rank) {
            case "A":
                if (currentTurn.total + 11 > 21) {
                    currentTurn.total += 1;
                } else {
                    currentTurn.total += 11;
                    currentTurn.aceOverage += 10;
                }
                break;
            case "K":
            case "Q":
            case "J":
                currentTurn.total += 10;
                break;
            default:
                currentTurn.total += numericValueRank;
        }
        if (
            this.player.total > 21 &&
            this.player.aceOverage === 0 &&
            currentTurn === this.player
        ) {
            this.checkTotals();
        } else if (currentTurn.total > 21 && currentTurn.aceOverage > 0) {
            currentTurn.total -= 10;
            currentTurn.aceOverage -= 10;
        }
    }
    initiateDealerTurn() {
        this.table.dealerFaceDownCard.style.display = "none";
        const continueDrawing = setInterval(() => {
            if (this.dealer.total < 17) {
                this.dealCardSound.play().catch((err) => {
                    console.error(err);
                });
                this.drawCard("Dealer");
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
        this.player.hand = [];
        this.dealer.hand = [];
        this.player.cardElements = [];
        this.player.splitHand = [];
        this.isHandSplit = false;
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
        this.table.playerSection.replaceChildren();
        this.table.splitSection.replaceChildren();
        const splitCard = this.player.splitHand[0];
        if (splitCard)
            this.table.renderCard("Player", splitCard.rank, splitCard.suit);
        this.player.currentBet = this.splitBet;
        if (typeof splitCard.rank === "string") {
            if (splitCard.rank === "A") {
                this.player.total = 11;
                this.player.aceOverage = 10;
            } else {
                this.player.total = 10;
            }
        } else {
            this.player.total = splitCard.rank;
        }
        this.table.playerScoreText.textContent = this.player.total.toString();
        this.table.newGameButton.style.display = "none";
        this.table.completeSplitBtn.style.display = "inline-block";
        this.table.resetModal.showModal();
    }
    drawCard(currentTurn: string) {
        if (this.deck.cards.length < 1) {
            this.deck.generateDeck();
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        if (currentTurn === "Player") {
            this.player.hand.push(newCard);
            this.getRankValue(newCard.rank, this.player);
            this.table.playerScoreText.textContent =
                this.player.total.toString();
        } else {
            this.dealer.hand.push(newCard);
            this.getRankValue(newCard.rank, this.dealer);
            this.table.dealerScoreText.textContent =
                this.dealer.total.toString();
        }
        this.table.renderCard(currentTurn, newCard.rank, newCard.suit);
        this.deck.cards.splice(index, 1);
    }
    checkTotals() {
        if (this.player.total > 21) {
            if (this.player.money > 0) {
                this.endGame("You lose, better luck next time!", false);
            } else {
                this.player.money = 100;
                this.endGame(
                    "Game over, you ran out of money! Restart with $100?",
                    true
                );
            }
        } else if (this.dealer.total > 21) {
            this.player.money += this.player.currentBet * 2;
            this.endGame("You win, well done!", false);
        } else {
            if (this.player.total > this.dealer.total) {
                this.player.money += this.player.currentBet * 2;
                this.endGame("You win, well done!", false);
            } else if (this.player.total === this.dealer.total) {
                this.player.money += this.player.currentBet;
                this.endGame("Push. Try again?", false);
            } else if (
                this.player.total < this.dealer.total &&
                this.player.money > 0
            ) {
                this.endGame("You lose, better luck next time!", false);
            } else {
                this.player.money = 100;
                this.endGame(
                    "Game over, you ran out of money! Restart with $100?",
                    true
                );
            }
        }
        this.table.totalMoneyText.textContent = this.player.money.toString();
    }
    endGame(resultText: string, isGameOver: boolean) {
        this.table.gameResultText.textContent = resultText;
        this.table.disableSelections();
        this.table.disableBets();
        this.table.totalMoneyText.textContent = this.player.money.toString();
        this.determineHighScore();
        if (!this.isHandSplit) {
            if (!isGameOver) {
                this.table.newGameButton.textContent = "New Hand";
            } else {
                this.table.newGameButton.textContent = "Start New Game";
            }
            this.table.resetModal.showModal();
        } else {
            this.resetSplit();
        }
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
