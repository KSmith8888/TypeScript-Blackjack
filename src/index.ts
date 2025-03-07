/**
 * Copyright Kevyn Smith 2022-2025
 * https://github.com/KSmith8888/TypeScript-Blackjack/blob/main/LICENSE
 * @license SPDX-License-Identifier: MIT
 */

import Player from "./player.ts";
import Dealer from "./dealer.ts";
import Deck from "./deck.ts";
import Hand from "./hand.ts";
import Table from "./table.ts";
import SettingsMenu from "./settings-menu.ts";
import SideBetsMenu from "./side-bets-menu.ts";
import SideBets from "./side-bets.ts";

import "../assets/styles/index.css";

export default class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    table: Table;
    settings: SettingsMenu;
    sideBetsMenu: SideBetsMenu;
    sideBets: SideBets;
    isFinalHand: boolean;
    highScore: number;
    constructor() {
        this.deck = new Deck(this);
        this.player = new Player(this);
        this.dealer = new Dealer(this);
        this.table = new Table(this);
        this.settings = new SettingsMenu(this);
        this.sideBetsMenu = new SideBetsMenu(this);
        this.sideBets = new SideBets(this);
        this.isFinalHand = true;
        this.highScore = 100;
    }
    startRound() {
        let shuffleDelay = 0;
        if (this.deck.cards.length < this.settings.shoePenetration) {
            if (this.settings.drawDelay !== 0) {
                shuffleDelay = 4000;
                this.deck.shuffleModal.showModal();
            }
            this.deck.shuffleCards();
        }
        setTimeout(() => {
            this.deck.playCardSound();
            setTimeout(() => {
                const initHand = new Hand();
                this.player.hands.push(initHand);
                this.player.drawCard();
                this.deck.playCardSound();
            }, this.settings.drawDelay);
            setTimeout(() => {
                this.dealer.drawCard(false);
                this.deck.playCardSound();
            }, this.settings.drawDelay * 2);
            setTimeout(() => {
                this.player.drawCard();
                this.deck.playCardSound();
            }, this.settings.drawDelay * 3);
            setTimeout(() => {
                this.dealer.drawCard(true);
                this.table.dealerSection.append(this.table.dealerFaceDownCard);
                this.table.dealerFaceDownCard.classList.remove("hidden");
                this.table.dealerScoreText.textContent = "??";
                if (
                    this.settings.insuranceOption &&
                    this.dealer.hand[0].rank === "A" &&
                    this.player.money >= Math.floor(this.player.currentBet / 2)
                ) {
                    this.table.insuranceBet.textContent = Math.floor(
                        this.player.currentBet / 2
                    ).toString(10);
                    this.table.insuranceModal.showModal();
                } else {
                    this.initHandCheck();
                }
            }, this.settings.drawDelay * 4);
        }, shuffleDelay);
    }
    #insurancePayout() {
        this.player.money += this.player.currentBet;
        this.table.totalMoneyText.textContent = `$${this.player.money.toString(
            10
        )}`;
    }
    initHandCheck() {
        const currentHand = this.player.hands[this.player.currentHand];
        if (this.sideBetsMenu.sideBetAmount > 0) {
            this.sideBets.checkForMatches(currentHand.cards);
        }
        if (currentHand.total === 21) {
            if (this.dealer.total !== 21) {
                setTimeout(() => {
                    this.deck.playInitWinSound();
                }, 500);
                currentHand.result = "Blackjack";
                currentHand.resultText = "BlackJack, well done!";
                this.endRound();
            } else {
                if (this.player.hasInsurance) this.#insurancePayout();
                currentHand.result = "Push";
                currentHand.resultText = "Push. Try again?";
                this.endRound();
            }
        } else if (this.dealer.total === 21) {
            if (this.player.hasInsurance) this.#insurancePayout();
            setTimeout(() => {
                this.deck.playInitLossSound();
            }, 500);
            currentHand.result = "Lost";
            currentHand.resultText =
                "Dealer got BlackJack, better luck next time!";
            this.endRound();
        } else {
            this.table.surrenderButton.disabled = false;
            const initHand = this.player.hands[0];
            const canHit =
                this.player.hands[this.player.currentHand].total < 21;
            const canDouble =
                canHit && this.player.money >= this.player.currentBet;
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
            else if (result === "Blackjack")
                this.player.money += Math.floor(bet * 1.5) + bet;
            else if (result === "Surrender")
                this.player.money += Math.floor(bet / 2);
        });
        if (this.player.money >= 5) {
            this.table.newGameButton.textContent = "New Hand";
        } else {
            this.table.gameOverText.classList.remove("hidden");
            this.table.newGameButton.textContent = "Start New Game";
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
        this.player.hasInsurance = false;
        this.table.dealerSection.replaceChildren();
        this.table.playerSection.replaceChildren();
        this.table.splitSection.replaceChildren();
        this.table.gameResultText.textContent = "";
        this.table.playerScoreText.textContent = "0";
        this.table.dealerScoreText.textContent = "0";
        this.table.gameOverText.classList.add("hidden");
        this.table.disableSelections();
        this.table.activateBets(this.player.money);
        this.sideBets.countdown();
    }
    nextHand() {
        this.player.currentHand += 1;
        this.isFinalHand =
            this.player.hands.length === this.player.currentHand + 1;
        const currentHand = this.player.hands[this.player.currentHand];
        const splitCard = currentHand.cards[0];
        const rankResult = this.getRankValue(splitCard.rank, currentHand.total);
        currentHand.total += rankResult.value;
        this.deck.playCardSound();
        setTimeout(() => {
            this.player.drawCard();
            const canHit =
                this.player.hands[this.player.currentHand].total < 21;
            const canDouble =
                canHit && this.player.money >= this.player.currentBet;
            if (splitCard.rank !== "A" || this.settings.hitOnSplitAces) {
                this.table.activateSelections(canHit, canDouble, false);
            } else {
                this.table.activateSelections(false, false, false);
            }
        }, this.settings.drawDelay);
        this.table.playerScoreText.textContent = currentHand.total.toString();
        this.table.newGameButton.classList.remove("hidden");
        this.table.nextHandBtn.classList.add("hidden");
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
        this.table.totalMoneyText.textContent = `$${this.player.money.toString(
            10
        )}`;
        this.#determineHighScore();
        setTimeout(() => {
            this.showResultText();
        }, 750);
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
    initSetup() {
        this.table.disableSelections();
        this.#checkSavedHighScore();
        this.settings.checkSavedSettings();
        this.sideBets.resetBets(true);
    }
}
const game = new Game();
game.initSetup();
