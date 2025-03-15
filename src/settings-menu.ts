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
    sideBetOption: boolean;
    surrenderOption: boolean;
    insuranceOption: boolean;
    autoReset: boolean;
    isSoundMutedBtn: HTMLButtonElement;
    volumeInput: HTMLInputElement;
    numberOfDecksInput: HTMLInputElement;
    hitOnSoft17Btn: HTMLButtonElement;
    hitOnSplitAcesBtn: HTMLButtonElement;
    relaxedSpeedBtn: HTMLButtonElement;
    normalSpeedBtn: HTMLButtonElement;
    instantSpeedBtn: HTMLButtonElement;
    sideBetOptionBtn: HTMLButtonElement;
    surrenderOptionBtn: HTMLButtonElement;
    insuranceOptionBtn: HTMLButtonElement;
    autoResetBtn: HTMLButtonElement;
    constructor(game: Game) {
        this.game = game;
        this.#settingsModal = <HTMLDialogElement>(
            document.getElementById("settings-modal")
        );
        this.#settingsModal.addEventListener("click", (e) => {
            if (e.target === e.currentTarget) this.#settingsModal.close();
        });
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
        this.sideBetOption = true;
        this.surrenderOption = true;
        this.insuranceOption = true;
        this.autoReset = true;
        this.isSoundMutedBtn = <HTMLButtonElement>(
            document.getElementById("mute-audio-setting")
        );
        this.isSoundMutedBtn.addEventListener("click", () => {
            if (this.isSoundMuted) {
                this.isSoundMuted = false;
                this.isSoundMutedBtn.textContent = "Mute";
                localStorage.setItem("mute-setting", "false");
                this.volumeInput.disabled = false;
            } else {
                this.isSoundMuted = true;
                this.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
                this.volumeInput.disabled = true;
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
        this.volumeInput = <HTMLInputElement>(
            document.getElementById("volume-setting")
        );
        this.volumeInput.addEventListener("change", () => {
            const value = parseInt(this.volumeInput.value, 10);
            if (value === 100) {
                localStorage.setItem("volume-setting", "High");
                this.updateVolume("High");
            } else if (value === 50) {
                localStorage.setItem("volume-setting", "Medium");
                this.updateVolume("Medium");
            } else {
                localStorage.setItem("volume-setting", "Low");
                this.updateVolume("Low");
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
            this.game.deck.playShuffleSound();
            this.game.deck.shuffleModal.showModal();
            setTimeout(() => {
                this.game.deck.shuffleModal.close();
            }, 4000);
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
            this.drawDelay = 1200;
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
            this.drawDelay = 250;
            this.instantSpeedBtn.disabled = true;
            this.relaxedSpeedBtn.disabled = false;
            this.normalSpeedBtn.disabled = false;
            localStorage.setItem(
                "draw-speed-setting",
                this.drawDelay.toString(10)
            );
        });
        this.sideBetOptionBtn = <HTMLButtonElement>(
            document.getElementById("side-bet-setting")
        );
        this.sideBetOptionBtn.addEventListener("click", () => {
            if (this.sideBetOption) {
                this.sideBetOption = false;
                this.sideBetOptionBtn.textContent = "Turn On";
                this.game.sideBetsMenu.openSideBetsBtn.classList.add("hidden");
                localStorage.setItem("side-bet-setting", "false");
                this.game.sideBetsMenu.turnOffSideBets();
            } else {
                this.sideBetOption = true;
                this.sideBetOptionBtn.textContent = "Turn Off";
                this.game.sideBetsMenu.openSideBetsBtn.classList.remove(
                    "hidden"
                );
                localStorage.setItem("side-bet-setting", "true");
            }
        });
        this.surrenderOptionBtn = <HTMLButtonElement>(
            document.getElementById("surrender-setting")
        );
        this.surrenderOptionBtn.addEventListener("click", () => {
            if (this.surrenderOption) {
                this.surrenderOption = false;
                this.surrenderOptionBtn.textContent = "Turn On";
                this.game.table.surrenderButton.classList.add("hidden");
                localStorage.setItem("surrender-setting", "false");
            } else {
                this.surrenderOption = true;
                this.surrenderOptionBtn.textContent = "Turn Off";
                this.game.table.surrenderButton.classList.remove("hidden");
                localStorage.setItem("surrender-setting", "true");
            }
        });
        this.insuranceOptionBtn = <HTMLButtonElement>(
            document.getElementById("insurance-setting")
        );
        this.insuranceOptionBtn.addEventListener("click", () => {
            if (this.insuranceOption) {
                this.insuranceOption = false;
                this.insuranceOptionBtn.textContent = "Turn On";
                localStorage.setItem("insurance-setting", "false");
            } else {
                this.insuranceOption = true;
                this.insuranceOptionBtn.textContent = "Turn Off";
                localStorage.setItem("insurance-setting", "true");
            }
        });
        this.autoResetBtn = <HTMLButtonElement>(
            document.getElementById("auto-reset-setting")
        );
        this.autoResetBtn.addEventListener("click", () => {
            if (this.autoReset) {
                this.autoReset = false;
                this.autoResetBtn.textContent = "Turn On";
                localStorage.setItem("auto-reset-setting", "false");
            } else {
                this.autoReset = true;
                this.autoResetBtn.textContent = "Turn Off";
                localStorage.setItem("auto-reset-setting", "true");
                this.game.table.newGameButton.classList.add("hidden");
            }
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
            if (drawDelayNum === 250) {
                this.drawDelay = 250;
                this.instantSpeedBtn.disabled = true;
            } else if (drawDelayNum === 750) {
                this.drawDelay = 750;
                this.normalSpeedBtn.disabled = true;
            } else {
                this.drawDelay = 1200;
                this.relaxedSpeedBtn.disabled = true;
            }
        } else {
            this.normalSpeedBtn.disabled = true;
        }
        this.game.sideBetsMenu.checkSavedSetting();
        const surrenderSetting = localStorage.getItem("surrender-setting");
        if (surrenderSetting) {
            if (surrenderSetting === "false") {
                this.surrenderOption = false;
                this.surrenderOptionBtn.textContent = "Turn On";
                this.game.table.surrenderButton.classList.add("hidden");
            } else {
                this.surrenderOption = true;
                this.surrenderOptionBtn.textContent = "Turn Off";
                this.game.table.surrenderButton.classList.remove("hidden");
            }
        }
        const insuranceOption = localStorage.getItem("insurance-setting");
        if (insuranceOption) {
            if (insuranceOption === "false") {
                this.insuranceOption = false;
                this.insuranceOptionBtn.textContent = "Turn On";
            } else {
                this.insuranceOption = true;
                this.insuranceOptionBtn.textContent = "Turn Off";
            }
        }
        const autoResetSetting = localStorage.getItem("auto-reset-setting");
        if (autoResetSetting) {
            if (autoResetSetting === "false") {
                this.autoReset = false;
                this.autoResetBtn.textContent = "Turn On";
            } else {
                this.autoReset = true;
                this.autoResetBtn.textContent = "Turn Off";
            }
        }
        const volumeSetting = localStorage.getItem("volume-setting");
        if (volumeSetting === "High") {
            this.updateVolume("High");
        } else if (volumeSetting === "Medium") {
            this.updateVolume("Medium");
        } else if (volumeSetting === "Low") {
            this.updateVolume("Low");
        } else {
            this.updateVolume("Low");
        }
    }
    updateVolume(setting: string) {
        const sounds = [
            this.game.deck.shuffleSound,
            this.game.deck.dealCardSound,
            this.game.deck.flipCardSound,
            this.game.sideBets.wonSideBetSound,
            this.game.deck.initWinSound,
            this.game.deck.initLossSound,
        ];
        let newVolume = 0.3;
        if (setting === "Medium") {
            newVolume = 0.6;
        } else if (setting === "High") {
            newVolume = 0.9;
        }
        sounds.forEach((sound) => {
            sound.volume = newVolume;
        });
    }
}
