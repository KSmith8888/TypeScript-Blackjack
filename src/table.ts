import Game from "./index.js";

import clubsImage from "../assets/images/Clubs.png";
import diamondsImage from "../assets/images/Diamonds.png";
import heartsImage from "../assets/images/Hearts.png";
import spadesImage from "../assets/images/Spades.png";

export default class Table {
    game: Game;
    playerScoreText: HTMLSpanElement;
    playerSection: HTMLElement;
    dealerScoreText: HTMLSpanElement;
    dealerSection: HTMLElement;
    dealerFaceDownCard: HTMLDivElement;
    resetSection: HTMLElement;
    hitButton: HTMLButtonElement;
    stayButton: HTMLButtonElement;
    doubleDownBtn: HTMLButtonElement;
    splitButton: HTMLButtonElement;
    gameResultText: HTMLParagraphElement;
    rulesModal: HTMLDialogElement;
    resetModal: HTMLDialogElement;
    newGameButton: HTMLButtonElement;
    openRulesBtn: HTMLButtonElement;
    closeRulesBtn: HTMLButtonElement;
    topPayout: HTMLSpanElement;
    bet5Btn: HTMLButtonElement;
    bet10Btn: HTMLButtonElement;
    bet25Btn: HTMLButtonElement;
    bet50Btn: HTMLButtonElement;
    totalMoneyText: HTMLSpanElement;
    constructor(game: Game) {
        this.game = game;
        this.playerScoreText = <HTMLSpanElement>(
            document.getElementById("player-score")
        );
        this.playerSection = <HTMLElement>(
            document.getElementById("player-section")
        );
        this.dealerScoreText = <HTMLSpanElement>(
            document.getElementById("dealer-score")
        );
        this.dealerSection = <HTMLElement>(
            document.getElementById("dealer-section")
        );
        this.resetSection = <HTMLElement>(
            document.getElementById("reset-section")
        );
        this.newGameButton = <HTMLButtonElement>(
            document.getElementById("new-game-button")
        );
        this.hitButton = <HTMLButtonElement>(
            document.getElementById("hit-button")
        );
        this.stayButton = <HTMLButtonElement>(
            document.getElementById("stay-button")
        );
        this.doubleDownBtn = <HTMLButtonElement>(
            document.getElementById("double-down-button")
        );
        this.splitButton = <HTMLButtonElement>(
            document.getElementById("split-button")
        );
        this.gameResultText = <HTMLParagraphElement>(
            document.getElementById("game-result-text")
        );
        this.dealerFaceDownCard = document.createElement("div");
        this.dealerFaceDownCard.id = "dealer-face-down-card";
        this.dealerFaceDownCard.classList.add("blank-card-container");
        this.rulesModal = <HTMLDialogElement>(
            document.getElementById("rules-modal")
        );
        this.resetModal = <HTMLDialogElement>(
            document.getElementById("game-reset-modal")
        );
        this.newGameButton.addEventListener("click", () => {
            this.game.resetBoard();
        });
        this.openRulesBtn = <HTMLButtonElement>(
            document.getElementById("open-rules-button")
        );
        this.closeRulesBtn = <HTMLButtonElement>(
            document.getElementById("close-rules-button")
        );
        this.topPayout = <HTMLSpanElement>document.getElementById("top-payout");
        this.gameResultText = <HTMLParagraphElement>(
            document.getElementById("game-result-text")
        );
        this.dealerFaceDownCard = document.createElement("div");
        this.dealerFaceDownCard.id = "dealer-face-down-card";
        this.dealerFaceDownCard.classList.add("blank-card-container");
        this.rulesModal = <HTMLDialogElement>(
            document.getElementById("rules-modal")
        );
        this.resetModal = <HTMLDialogElement>(
            document.getElementById("game-reset-modal")
        );
        this.openRulesBtn.addEventListener("click", () => {
            this.rulesModal.showModal();
        });
        this.closeRulesBtn.addEventListener("click", () => {
            this.rulesModal.close();
        });
        this.openRulesBtn = <HTMLButtonElement>(
            document.getElementById("open-rules-button")
        );
        this.closeRulesBtn = <HTMLButtonElement>(
            document.getElementById("close-rules-button")
        );
        this.topPayout = <HTMLSpanElement>document.getElementById("top-payout");
        this.totalMoneyText = <HTMLSpanElement>(
            document.getElementById("total-money-text")
        );
        this.bet5Btn = <HTMLButtonElement>(
            document.getElementById("bet-5-button")
        );
        this.bet10Btn = <HTMLButtonElement>(
            document.getElementById("bet-10-button")
        );
        this.bet25Btn = <HTMLButtonElement>(
            document.getElementById("bet-25-button")
        );
        this.bet50Btn = <HTMLButtonElement>(
            document.getElementById("bet-50-button")
        );
        this.bet5Btn.addEventListener("click", () => {
            this.game.player.bet(5);
        });
        this.bet10Btn.addEventListener("click", () => {
            this.game.player.bet(10);
        });
        this.bet25Btn.addEventListener("click", () => {
            this.game.player.bet(25);
        });
        this.bet50Btn.addEventListener("click", () => {
            this.game.player.bet(50);
        });
    }
    activateSelections(money: number, currentBet: number): void {
        this.hitButton.disabled = false;
        this.stayButton.disabled = false;
        if (money >= currentBet) {
            this.doubleDownBtn.disabled = false;
        }
        this.hitButton.focus();
    }
    disableSelections(): void {
        this.hitButton.disabled = true;
        this.stayButton.disabled = true;
        this.doubleDownBtn.disabled = true;
        this.splitButton.disabled = true;
    }
    disableBets(money: number): void {
        this.bet5Btn.disabled = true;
        this.bet10Btn.disabled = true;
        this.bet25Btn.disabled = true;
        this.bet50Btn.disabled = true;
        this.totalMoneyText.textContent = money.toString();
    }
    activateBets(money: number): void {
        if (money >= 5) this.bet5Btn.disabled = false;
        if (money >= 10) this.bet10Btn.disabled = false;
        if (money >= 25) this.bet25Btn.disabled = false;
        if (money >= 50) this.bet50Btn.disabled = false;
    }
    renderCard(currentTurn: string, rank: string | number, suit: string) {
        const cardContainer = document.createElement("div");
        if (currentTurn === "Player") {
            this.playerSection.append(cardContainer);
        } else {
            this.dealerSection.append(cardContainer);
        }
        cardContainer.classList.add("card-container");
        const cardRankTop = document.createElement("p");
        cardRankTop.textContent = rank.toString();
        cardRankTop.classList.add("card-rank-top");
        const cardSuit = document.createElement("img");
        let suitImgSrc = "";
        if (suit === "Clubs") {
            suitImgSrc = clubsImage;
        } else if (suit === "Diamonds") {
            suitImgSrc = diamondsImage;
        } else if (suit === "Spades") {
            suitImgSrc = spadesImage;
        } else {
            suitImgSrc = heartsImage;
        }
        cardSuit.src = suitImgSrc;
        cardSuit.alt = suit;
        cardSuit.classList.add("card-suit");
        const cardRankBottom = document.createElement("p");
        cardRankBottom.textContent = rank.toString();
        cardRankBottom.classList.add("card-rank-bottom");
        cardContainer.append(cardRankTop);
        cardContainer.append(cardSuit);
        cardContainer.append(cardRankBottom);
    }
}
