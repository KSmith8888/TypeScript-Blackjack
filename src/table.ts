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
    splitSection: HTMLElement;
    nextHandBtn: HTMLButtonElement;
    dealerFaceDownCard: HTMLDivElement;
    resetSection: HTMLElement;
    #hitButton: HTMLButtonElement;
    #stayButton: HTMLButtonElement;
    #doubleDownBtn: HTMLButtonElement;
    #splitButton: HTMLButtonElement;
    gameResultText: HTMLParagraphElement;
    gameOverText: HTMLParagraphElement;
    rulesModal: HTMLDialogElement;
    resetModal: HTMLDialogElement;
    newGameButton: HTMLButtonElement;
    #openRulesBtn: HTMLButtonElement;
    #closeRulesBtn: HTMLButtonElement;
    #settingsModal: HTMLDialogElement;
    #openSettingsBtn: HTMLButtonElement;
    #closeSettingsBtn: HTMLButtonElement;
    muteAudioSetting: HTMLButtonElement;
    soft17Setting: HTMLButtonElement;
    hitSplitAcesSettings: HTMLButtonElement;
    numOfDecksSetting: HTMLInputElement;
    topPayout: HTMLSpanElement;
    #bet5Btn: HTMLButtonElement;
    #bet10Btn: HTMLButtonElement;
    #bet25Btn: HTMLButtonElement;
    #bet50Btn: HTMLButtonElement;
    totalMoneyText: HTMLSpanElement;
    shoeMeter: HTMLMeterElement;
    cardsRemaining: HTMLSpanElement;
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
        this.splitSection = <HTMLElement>(
            document.getElementById("split-section")
        );
        this.nextHandBtn = <HTMLButtonElement>(
            document.getElementById("next-hand-button")
        );
        this.nextHandBtn.addEventListener("click", () => {
            this.resetModal.close();
            this.game.nextHand();
        });
        this.resetSection = <HTMLElement>(
            document.getElementById("reset-section")
        );
        this.newGameButton = <HTMLButtonElement>(
            document.getElementById("new-game-button")
        );
        this.#hitButton = <HTMLButtonElement>(
            document.getElementById("hit-button")
        );
        this.#hitButton.addEventListener("click", () => {
            this.disableSelections();
            this.game.player.hit();
        });
        this.#stayButton = <HTMLButtonElement>(
            document.getElementById("stay-button")
        );
        this.#stayButton.addEventListener("click", () => {
            this.disableSelections();
            this.game.player.stay();
        });
        this.#doubleDownBtn = <HTMLButtonElement>(
            document.getElementById("double-down-button")
        );
        this.#doubleDownBtn.addEventListener("click", () => {
            this.disableSelections();
            this.game.player.double();
        });
        this.#splitButton = <HTMLButtonElement>(
            document.getElementById("split-button")
        );
        this.#splitButton.addEventListener("click", () => {
            this.disableSelections();
            this.game.player.split();
        });
        this.gameResultText = <HTMLParagraphElement>(
            document.getElementById("game-result-text")
        );
        this.gameOverText = <HTMLParagraphElement>(
            document.getElementById("game-over-text")
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
            this.resetModal.close();
            this.game.resetBoard();
        });
        this.topPayout = <HTMLSpanElement>document.getElementById("top-payout");
        this.#openRulesBtn = <HTMLButtonElement>(
            document.getElementById("open-rules-button")
        );
        this.#openRulesBtn.addEventListener("click", () => {
            this.rulesModal.showModal();
        });
        this.#closeRulesBtn = <HTMLButtonElement>(
            document.getElementById("close-rules-button")
        );
        this.#closeRulesBtn.addEventListener("click", () => {
            this.rulesModal.close();
        });
        this.#openSettingsBtn = <HTMLButtonElement>(
            document.getElementById("open-settings-button")
        );
        this.#settingsModal = <HTMLDialogElement>(
            document.getElementById("settings-modal")
        );
        this.#openSettingsBtn.addEventListener("click", () => {
            this.#settingsModal.showModal();
        });
        this.#closeSettingsBtn = <HTMLButtonElement>(
            document.getElementById("close-settings-button")
        );
        this.#closeSettingsBtn.addEventListener("click", () => {
            this.#settingsModal.close();
        });
        this.muteAudioSetting = <HTMLButtonElement>(
            document.getElementById("mute-audio-setting")
        );
        this.muteAudioSetting.addEventListener("click", () => {
            if (this.game.isSoundMuted) {
                this.game.isSoundMuted = false;
                this.muteAudioSetting.textContent = "Mute";
                localStorage.setItem("mute-setting", "false");
            } else {
                this.game.isSoundMuted = true;
                this.muteAudioSetting.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            }
        });
        this.soft17Setting = <HTMLButtonElement>(
            document.getElementById("soft-17-setting")
        );
        this.soft17Setting.addEventListener("click", () => {
            if (this.game.hitOnSoft17) {
                this.game.hitOnSoft17 = false;
                this.soft17Setting.textContent = "Turn On";
                localStorage.setItem("soft-17-setting", "false");
            } else {
                this.game.hitOnSoft17 = true;
                this.soft17Setting.textContent = "Turn Off";
                localStorage.setItem("soft-17-setting", "true");
            }
        });
        this.numOfDecksSetting = <HTMLInputElement>(
            document.getElementById("number-of-decks-setting")
        );
        this.numOfDecksSetting.addEventListener("change", () => {
            const value = parseInt(this.numOfDecksSetting.value, 10);
            if (typeof value === "number" && value >= 1 && value <= 8) {
                this.game.numberOfDecks = value;
            }
            const newMax = value * 52;
            this.shoeMeter.max = newMax;
            this.shoeMeter.value = newMax;
            this.game.shoePenetration = Math.floor((value * 52) / 4);
            localStorage.setItem("deck-number-setting", value.toString(10));
            this.game.deck.shuffleCards();
        });
        this.hitSplitAcesSettings = <HTMLButtonElement>(
            document.getElementById("hit-split-aces-setting")
        );
        this.hitSplitAcesSettings.addEventListener("click", () => {
            if (this.game.hitOnSplitAces) {
                this.game.hitOnSplitAces = false;
                this.hitSplitAcesSettings.textContent = "Turn On";
                localStorage.setItem("hit-split-aces-setting", "false");
            } else {
                this.game.hitOnSplitAces = true;
                this.hitSplitAcesSettings.textContent = "Turn Off";
                localStorage.setItem("hit-split-aces-setting", "true");
            }
        });
        this.totalMoneyText = <HTMLSpanElement>(
            document.getElementById("total-money-text")
        );
        this.shoeMeter = <HTMLMeterElement>(
            document.getElementById("shoe-meter")
        );
        this.cardsRemaining = <HTMLSpanElement>(
            document.getElementById("cards-remaining")
        );
        this.#bet5Btn = <HTMLButtonElement>(
            document.getElementById("bet-5-button")
        );
        this.#bet10Btn = <HTMLButtonElement>(
            document.getElementById("bet-10-button")
        );
        this.#bet25Btn = <HTMLButtonElement>(
            document.getElementById("bet-25-button")
        );
        this.#bet50Btn = <HTMLButtonElement>(
            document.getElementById("bet-50-button")
        );
        this.#bet5Btn.addEventListener("click", () => {
            this.game.player.bet(5);
        });
        this.#bet10Btn.addEventListener("click", () => {
            this.game.player.bet(10);
        });
        this.#bet25Btn.addEventListener("click", () => {
            this.game.player.bet(25);
        });
        this.#bet50Btn.addEventListener("click", () => {
            this.game.player.bet(50);
        });
    }
    activateSelections(canHit: boolean, canDouble: boolean, canSplit: boolean) {
        if (canHit) {
            this.#hitButton.disabled = false;
            this.#hitButton.focus();
        } else {
            this.#stayButton.focus();
        }
        this.#stayButton.disabled = false;
        if (canDouble) this.#doubleDownBtn.disabled = false;
        if (canSplit) this.#splitButton.disabled = false;
    }
    disableSelections() {
        this.#hitButton.disabled = true;
        this.#stayButton.disabled = true;
        this.#doubleDownBtn.disabled = true;
        this.#splitButton.disabled = true;
    }
    disableBets() {
        this.#bet5Btn.disabled = true;
        this.#bet10Btn.disabled = true;
        this.#bet25Btn.disabled = true;
        this.#bet50Btn.disabled = true;
    }
    activateBets(money: number) {
        this.#bet5Btn.disabled = false;
        this.#bet5Btn.focus();
        if (money >= 10) this.#bet10Btn.disabled = false;
        if (money >= 25) this.#bet25Btn.disabled = false;
        if (money >= 50) this.#bet50Btn.disabled = false;
    }
    renderCard(currentTurn: string, rank: string | number, suit: string) {
        const cardContainer = document.createElement("div");
        if (currentTurn === "Player") {
            if (this.game.player.currentHand === 0) {
                this.playerSection.append(cardContainer);
            } else {
                this.splitSection.append(cardContainer);
            }
            this.game.player.cardElements.push(cardContainer);
        } else if (currentTurn === "Dealer") {
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
