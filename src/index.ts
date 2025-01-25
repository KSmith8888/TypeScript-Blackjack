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
    startNewGame() {
        setTimeout(() => {
            this.dealCardSound.play().catch((err) => {
                console.error(err);
            });
            this.drawCard("Player", false);
            this.drawCard("Player", false);
            this.drawCard("Dealer", false);
            this.drawCard("Dealer", true);
            this.table.dealerSection.append(this.table.dealerFaceDownCard);
            this.table.dealerFaceDownCard.style.display = "block";
        }, 500);
        setTimeout(() => {
            this.initHandCheck();
        }, 500);
    }
    initHandCheck() {
        if (this.player.total === 21) {
            if (this.dealer.total !== 21) {
                this.player.money += this.player.currentBet * 2;
                this.endGame("You win, well done!");
            } else {
                this.player.money += this.player.currentBet;
                this.endGame("Push. Try again?");
            }
        } else if (this.dealer.total === 21) {
            this.endGame("You lose, better luck next time!");
        }
        const canSplit = this.player.hand[0].rank === this.player.hand[1].rank;
        this.table.activateSelections(
            this.player.money,
            this.player.currentBet,
            canSplit
        );
    }
    playerHit() {
        setTimeout(() => {
            this.dealCardSound.play().catch((err) => {
                console.error(err);
            });
            this.drawCard("Player", false);
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
                this.drawCard("Player", false);
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
            this.player.firstSplitHand = true;
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
                this.drawCard("Player", false);
            }, 500);
            this.table.activateSelections(
                this.player.money,
                this.player.currentBet,
                false
            );
        }
    }

    getRankValue(rank: string | number, currentTurn: Player | Dealer) {
        /*
        If the rank is 2-10, add the rank to the total. If the rank is Jack, Queen, or King add 10. If the rank is Ace and adding 11 would bust, then add 1, otherwise add 11
        */
        const numbericValue = typeof rank === "number" ? rank : 0;
        if (rank === "A") {
            if (currentTurn.total + 11 > 21) {
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
    initiateDealerTurn() {
        this.table.dealerFaceDownCard.style.display = "none";
        const continueDrawing = setInterval(() => {
            if (this.dealer.total < 17) {
                this.dealCardSound.play().catch((err) => {
                    console.error(err);
                });
                this.drawCard("Dealer", false);
            } else {
                clearInterval(continueDrawing);
                if (!this.player.secondSplitHand) {
                    this.checkTotals();
                } else {
                    this.completeSecondSplit();
                }
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
        this.player.firstSplitHand = false;
        this.player.secondSplitHand = false;
        this.player.firstSplitTotal = 0;
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
        this.player.firstSplitTotal = this.player.total;
        const splitCard = this.player.splitHand[0];
        this.player.currentBet = this.splitBet;
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
    drawCard(currentTurn: string, hidden: boolean) {
        if (this.deck.cards.length < 1) {
            this.deck.generateDeck();
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        if (currentTurn === "Player") {
            this.player.hand.push(newCard);
            const result = this.getRankValue(newCard.rank, this.player);
            this.player.total += result.value;
            if (result.aceOverage) this.player.aceOverage += 10;
            if (this.player.total > 21) {
                if (this.player.aceOverage > 0) {
                    this.player.total -= 10;
                    this.player.aceOverage -= 10;
                } else if (!this.player.secondSplitHand) {
                    this.checkTotals();
                } else {
                    this.completeSecondSplit();
                }
            }
            this.table.playerScoreText.textContent =
                this.player.total.toString();
        } else {
            this.dealer.hand.push(newCard);
            const result = this.getRankValue(newCard.rank, this.dealer);
            this.dealer.total += result.value;
            if (result.aceOverage) this.dealer.aceOverage += 10;
            if (this.dealer.total > 21) {
                if (this.dealer.aceOverage > 0) {
                    this.dealer.total -= 10;
                    this.dealer.aceOverage -= 10;
                } else if (!this.player.secondSplitHand) {
                    this.checkTotals();
                } else {
                    this.completeSecondSplit();
                }
            }
            this.table.dealerScoreText.textContent =
                this.dealer.total.toString();
        }
        if (!hidden)
            this.table.renderCard(currentTurn, newCard.rank, newCard.suit);
        this.deck.cards.splice(index, 1);
    }
    completeSecondSplit() {
        const firstResult = this.whoWonHand(
            this.player.firstSplitTotal,
            this.dealer.total
        );
        const secondResult = this.whoWonHand(
            this.player.total,
            this.dealer.total
        );
        if (firstResult + secondResult === 10) {
            this.endGame("You won both hands, well done!");
        } else if (firstResult + secondResult === 0) {
            this.endGame("Sorry, you lost both hands, better luck next time!");
        } else if (firstResult + secondResult === 2) {
            this.endGame("Both hands were a push. Try again?");
        } else if (firstResult + secondResult === 6) {
            this.endGame("Pushed one hand and won the other. Try again?");
        } else if (firstResult + secondResult === 5) {
            this.endGame("Won a hand and lost a hand. Try again?");
        } else {
            this.endGame("Pushed one hand and lost the other. Try again?");
        }
        this.table.totalMoneyText.textContent = this.player.money.toString();
    }
    whoWonHand(playerTotal: number, dealerTotal: number) {
        if (playerTotal > 21) {
            return 0;
        } else if (dealerTotal > 21) {
            return 5;
        } else {
            if (playerTotal > dealerTotal) {
                return 5;
            } else if (playerTotal === dealerTotal) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    checkTotals() {
        if (this.player.total > 21) {
            if (this.player.money > 0) {
                this.endGame("You lose, better luck next time!");
            } else {
                this.player.money = 100;
                this.endGame(
                    "Game over, you ran out of money! Restart with $100?"
                );
            }
        } else if (this.dealer.total > 21) {
            this.player.money += this.player.currentBet * 2;
            this.endGame("You win, well done!");
        } else {
            if (this.player.total > this.dealer.total) {
                this.player.money += this.player.currentBet * 2;
                this.endGame("You win, well done!");
            } else if (this.player.total === this.dealer.total) {
                this.player.money += this.player.currentBet;
                this.endGame("Push. Try again?");
            } else if (
                this.player.total < this.dealer.total &&
                this.player.money > 0
            ) {
                this.endGame("You lose, better luck next time!");
            } else {
                this.player.money = 100;
                this.endGame(
                    "Game over, you ran out of money! Restart with $100?"
                );
            }
        }
        this.table.totalMoneyText.textContent = this.player.money.toString();
    }
    endGame(resultText: string) {
        this.table.gameResultText.textContent = resultText;
        this.table.disableSelections();
        this.table.disableBets();
        this.table.totalMoneyText.textContent = this.player.money.toString();
        this.determineHighScore();
        if (!this.player.firstSplitHand) {
            if (this.player.money > 0) {
                this.table.newGameButton.textContent = "Start New Game";
                this.player.money = 100;
            } else {
                this.table.newGameButton.textContent = "New Hand";
            }
        } else {
            this.table.newGameButton.style.display = "none";
            this.table.completeSplitBtn.style.display = "inline-block";
            this.resetSplit();
        }
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
