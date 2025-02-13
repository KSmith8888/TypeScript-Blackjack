import Game from "./index.ts";

export default class SettingsMenu {
    game: Game;
    #settingsModal: HTMLDialogElement;
    #openSettingsBtn: HTMLButtonElement;
    #closeSettingsBtn: HTMLButtonElement;
    isSoundMuted: boolean;
    numberOfDecks: number;
    shoePenetration: number;
    hitOnSoft17: boolean;
    hitOnSplitAces: boolean;
    drawDelay: number;
    isSoundMutedBtn: HTMLButtonElement;
    numberOfDecksInput: HTMLInputElement;
    hitOnSoft17Btn: HTMLButtonElement;
    hitOnSplitAcesBtn: HTMLButtonElement;
    relaxedSpeedBtn: HTMLButtonElement;
    normalSpeedBtn: HTMLButtonElement;
    instantSpeedBtn: HTMLButtonElement;
    constructor(game: Game) {
        this.game = game;
        this.#settingsModal = <HTMLDialogElement>(
            document.getElementById("settings-modal")
        );
        this.#openSettingsBtn = <HTMLButtonElement>(
            document.getElementById("open-settings-button")
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
        this.isSoundMuted = false;
        this.numberOfDecks = 4;
        this.shoePenetration = Math.floor((this.numberOfDecks * 52) / 4);
        this.hitOnSoft17 = false;
        this.hitOnSplitAces = false;
        this.drawDelay = 750;
        this.isSoundMutedBtn = <HTMLButtonElement>(
            document.getElementById("mute-audio-setting")
        );
        this.isSoundMutedBtn.addEventListener("click", () => {
            if (this.isSoundMuted) {
                this.isSoundMuted = false;
                this.isSoundMutedBtn.textContent = "Mute";
                localStorage.setItem("mute-setting", "false");
            } else {
                this.isSoundMuted = true;
                this.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            }
        });
        this.hitOnSoft17Btn = <HTMLButtonElement>(
            document.getElementById("soft-17-setting")
        );
        this.hitOnSoft17Btn.addEventListener("click", () => {
            if (this.hitOnSoft17) {
                this.hitOnSoft17 = false;
                this.hitOnSoft17Btn.textContent = "Turn On";
                localStorage.setItem("soft-17-setting", "false");
            } else {
                this.hitOnSoft17 = true;
                this.hitOnSoft17Btn.textContent = "Turn Off";
                localStorage.setItem("soft-17-setting", "true");
            }
        });
        this.numberOfDecksInput = <HTMLInputElement>(
            document.getElementById("number-of-decks-setting")
        );
        this.numberOfDecksInput.addEventListener("change", () => {
            const value = parseInt(this.numberOfDecksInput.value, 10);
            if (typeof value === "number" && value >= 1 && value <= 8) {
                this.numberOfDecks = value;
            }
            const newMax = value * 52;
            this.game.table.shoeMeter.max = newMax;
            this.game.table.shoeMeter.value = newMax;
            this.shoePenetration = Math.floor((value * 52) / 4);
            localStorage.setItem("deck-number-setting", value.toString(10));
            this.game.deck.shuffleCards();
        });
        this.hitOnSplitAcesBtn = <HTMLButtonElement>(
            document.getElementById("hit-split-aces-setting")
        );
        this.hitOnSplitAcesBtn.addEventListener("click", () => {
            if (this.hitOnSplitAces) {
                this.hitOnSplitAces = false;
                this.hitOnSplitAcesBtn.textContent = "Turn On";
                localStorage.setItem("hit-split-aces-setting", "false");
            } else {
                this.hitOnSplitAces = true;
                this.hitOnSplitAcesBtn.textContent = "Turn Off";
                localStorage.setItem("hit-split-aces-setting", "true");
            }
        });
        this.relaxedSpeedBtn = <HTMLButtonElement>(
            document.getElementById("relaxed-speed-setting")
        );
        this.relaxedSpeedBtn.addEventListener("click", () => {
            this.drawDelay = 1500;
            this.relaxedSpeedBtn.disabled = true;
            this.normalSpeedBtn.disabled = false;
            this.instantSpeedBtn.disabled = false;
            localStorage.setItem(
                "draw-speed-setting",
                this.drawDelay.toString(10)
            );
        });
        this.normalSpeedBtn = <HTMLButtonElement>(
            document.getElementById("normal-speed-setting")
        );
        this.normalSpeedBtn.addEventListener("click", () => {
            this.drawDelay = 750;
            this.normalSpeedBtn.disabled = true;
            this.relaxedSpeedBtn.disabled = false;
            this.instantSpeedBtn.disabled = false;
            localStorage.setItem(
                "draw-speed-setting",
                this.drawDelay.toString(10)
            );
        });
        this.instantSpeedBtn = <HTMLButtonElement>(
            document.getElementById("instant-speed-setting")
        );
        this.instantSpeedBtn.addEventListener("click", () => {
            this.drawDelay = 0;
            this.instantSpeedBtn.disabled = true;
            this.relaxedSpeedBtn.disabled = false;
            this.normalSpeedBtn.disabled = false;
            localStorage.setItem(
                "draw-speed-setting",
                this.drawDelay.toString(10)
            );
        });
    }
    checkSavedSettings() {
        const muteSetting = localStorage.getItem("mute-setting");
        if (muteSetting === "true") {
            this.isSoundMuted = true;
            this.isSoundMutedBtn.textContent = "Unmute";
        } else if (muteSetting === "false") {
            this.isSoundMuted = false;
            this.isSoundMutedBtn.textContent = "Mute";
        }
        const soft17Setting = localStorage.getItem("soft-17-setting");
        if (soft17Setting === "true") {
            this.hitOnSoft17 = true;
            this.hitOnSoft17Btn.textContent = "Turn Off";
        } else if (soft17Setting === "false") {
            this.hitOnSoft17 = false;
            this.hitOnSoft17Btn.textContent = "Turn On";
        }
        const deckNumberSetting = localStorage.getItem("deck-number-setting");
        if (deckNumberSetting) {
            const deckNum = parseInt(deckNumberSetting, 10);
            if (typeof deckNum === "number" && deckNum >= 1 && deckNum < 9) {
                this.numberOfDecks = deckNum;
                this.game.table.shoeMeter.max = deckNum * 52;
                this.shoePenetration = Math.floor((deckNum * 52) / 4);
                this.numberOfDecksInput.value = deckNum.toString(10);
            }
        }
        const hitSplitAcesSetting = localStorage.getItem(
            "hit-split-aces-setting"
        );
        if (hitSplitAcesSetting === "true") {
            this.hitOnSplitAces = true;
            this.hitOnSplitAcesBtn.textContent = "Turn Off";
        } else if (hitSplitAcesSetting === "false") {
            this.hitOnSplitAces = false;
            this.hitOnSplitAcesBtn.textContent = "Turn On";
        }
        const drawSpeedSetting = localStorage.getItem("draw-speed-setting");
        if (drawSpeedSetting) {
            const drawDelayNum = parseInt(drawSpeedSetting, 10);
            if (drawDelayNum === 0) {
                this.drawDelay = 0;
                this.instantSpeedBtn.disabled = true;
            } else if (drawDelayNum === 750) {
                this.drawDelay = 750;
                this.normalSpeedBtn.disabled = true;
            } else {
                this.drawDelay = 1500;
                this.relaxedSpeedBtn.disabled = true;
            }
        } else {
            this.normalSpeedBtn.disabled = true;
        }
    }
}
