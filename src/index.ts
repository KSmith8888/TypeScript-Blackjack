import Player from "./player.js";
import Dealer from "./dealer.js";
import { Deck } from "./deck.js";
import Table from "./table.js";

import cardAudioSrc from "../assets/audio/deal-card-sound.wav";
import "../assets/styles/index.css";

export default class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    table: Table;
    dealCardSound: HTMLAudioElement;
    constructor() {
        this.deck = new Deck();
        this.player = new Player(this);
        this.dealer = new Dealer();
        this.table = new Table(this);
        this.dealCardSound = new Audio(cardAudioSrc);
        this.dealCardSound.volume = 0.5;
        this.table.hitButton.addEventListener("click", () => {
            this.table.disableSelections();
            setTimeout(() => {
                this.dealCardSound.play().catch((err) => {
                    console.error(err);
                });
                this.drawCard("Player");
                if (
                    this.player.total <= 21 &&
                    this.table.hitButton &&
                    this.table.stayButton
                ) {
                    this.table.hitButton.disabled = false;
                    this.table.stayButton.disabled = false;
                }
            }, 750);
        });
        this.table.stayButton.addEventListener("click", () => {
            this.table.disableSelections();
            this.initiateDealerTurn();
        });
        this.table.doubleDownBtn.addEventListener("click", () => {
            this.table.disableSelections();
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
        });
        this.table.splitButton.addEventListener("click", () => {
            console.log("Split");
        });
    }
    startNewGame(): void {
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
    getRankValue(rank: string | number, currentTurn: Player | Dealer): void {
        /*
        If the rank is 2-10, add the rank to the total. If the rank is Jack, Queen, or King add 10. If the rank is Ace and adding 11 would bust, then add 1, otherwise add 11
        */
        const numericValueRank: number = typeof rank === "number" ? rank : 0;
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
        if (currentTurn === this.player) {
            this.table.playerScoreText.textContent =
                this.player.total.toString();
        }
        if (currentTurn === this.dealer) {
            this.table.dealerScoreText.textContent =
                this.dealer.total.toString();
        }
    }
    initiateDealerTurn(): void {
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
    resetBoard(): void {
        this.player.total = 0;
        this.dealer.total = 0;
        this.player.currentBet = 0;
        this.player.aceOverage = 0;
        this.dealer.aceOverage = 0;
        this.player.hand = [];
        this.dealer.hand = [];
        this.table.dealerSection.replaceChildren();
        this.table.playerSection.replaceChildren();
        this.table.gameResultText.textContent = "";
        this.table.playerScoreText.textContent = "0";
        this.table.dealerScoreText.textContent = "0";
        //Needed in case of bust on double down because dealers turn is never initiated
        this.table.dealerFaceDownCard.style.display = "none";
        this.table.resetModal.close();
        this.table.activateBets(this.player.money);
        this.table.bet5Btn.focus();
    }

    drawCard(currentTurn: string): void {
        if (this.deck.cards.length < 1) {
            this.deck.generateDeck();
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        if (currentTurn === "Player") {
            this.player.hand.push(newCard);
            this.getRankValue(newCard.rank, this.player);
        } else {
            this.dealer.hand.push(newCard);
            this.getRankValue(newCard.rank, this.dealer);
        }
        this.table.renderCard(currentTurn, newCard.rank, newCard.suit);
        this.deck.cards.splice(index, 1);
    }
    checkTotals(): void {
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
    endGame(resultText: string, isGameOver: boolean): void {
        this.table.gameResultText.textContent = resultText;
        this.table.disableSelections();
        this.table.disableBets(this.player.money);
        if (!isGameOver) {
            this.table.newGameButton.textContent = "New Hand";
        } else {
            this.table.newGameButton.textContent = "Start New Game";
        }
        this.determineHighScore();
        this.table.resetModal.showModal();
    }
    determineHighScore() {
        if (localStorage.getItem("high-score") !== null) {
            const highScore = localStorage.getItem("high-score");
            if (
                highScore !== null &&
                this.player.money > parseInt(JSON.parse(highScore), 10)
            ) {
                localStorage.setItem(
                    "high-score",
                    JSON.stringify(this.player.money)
                );
                this.table.topPayout.textContent = this.player.money.toString();
            } else if (
                highScore !== null &&
                this.player.money < parseInt(JSON.parse(highScore), 10)
            ) {
                this.table.topPayout.textContent = JSON.parse(highScore);
            }
        } else {
            localStorage.setItem("high-score", JSON.stringify(100));
        }
    }
}

const game = new Game();
game.table.disableSelections();
game.determineHighScore();
