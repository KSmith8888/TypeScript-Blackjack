import Game from "./index.ts";
import Card from "./card.ts";

import drawCardSound from "../assets/audio/card-sound-one.mp3";
import flipCardSound from "../assets/audio/card-sound-two.mp3";
import shuffleSound from "../assets/audio/shuffle-sound.mp3";
import initWinSound from "../assets/audio/ui-sound-one.mp3";
import initLossSound from "../assets/audio/ui-sound-three.mp3";

export default class Deck {
    game: Game;
    cards: Card[];
    #suits: string[];
    #ranks: (number | string)[];
    shuffleModal: HTMLDialogElement;
    dealCardSound: HTMLAudioElement;
    flipCardSound: HTMLAudioElement;
    shuffleSound: HTMLAudioElement;
    initWinSound: HTMLAudioElement;
    initLossSound: HTMLAudioElement;
    constructor(game: Game) {
        this.game = game;
        this.cards = [];
        this.#suits = ["Hearts", "Clubs", "Spades", "Diamonds"];
        this.#ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
        this.shuffleModal = <HTMLDialogElement>(
            document.getElementById("shuffle-modal")
        );
        this.dealCardSound = new Audio(drawCardSound);
        this.flipCardSound = new Audio(flipCardSound);
        this.shuffleSound = new Audio(shuffleSound);
        this.initWinSound = new Audio(initWinSound);
        this.initLossSound = new Audio(initLossSound);
    }
    #createCard(suit: string, rank: string | number): Card {
        return new Card(suit, rank);
    }
    #generateDeck(): void {
        for (const suit of this.#suits) {
            for (const rank of this.#ranks) {
                this.cards.push(this.#createCard(suit, rank));
            }
        }
    }
    getCardIndex(): number {
        const randomNumber: number = Math.floor(
            Math.random() * this.cards.length
        );
        return randomNumber;
    }
    playCardSound() {
        if (!this.game.settings.isSoundMuted) {
            this.dealCardSound.currentTime = 0;
            this.dealCardSound.play().catch((err: unknown) => {
                if (err instanceof Error) console.error(err.message);
                this.game.settings.isSoundMuted = true;
                this.game.settings.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            });
        }
    }
    playFlipSound() {
        if (!this.game.settings.isSoundMuted) {
            this.flipCardSound.currentTime = 0;
            this.flipCardSound.play().catch((err: unknown) => {
                if (err instanceof Error) console.error(err.message);
                this.game.settings.isSoundMuted = true;
                this.game.settings.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            });
        }
    }
    playShuffleSound() {
        if (
            !this.game.settings.isSoundMuted &&
            this.game.settings.drawDelay !== 250
        ) {
            this.shuffleSound.currentTime = 0;
            this.shuffleSound.play().catch((err: unknown) => {
                if (err instanceof Error) console.error(err.message);
                this.game.settings.isSoundMuted = true;
                this.game.settings.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            });
        }
    }
    playInitWinSound() {
        if (!this.game.settings.isSoundMuted) {
            this.initWinSound.currentTime = 0;
            this.initWinSound.play().catch((err: unknown) => {
                if (err instanceof Error) console.error(err.message);
                this.game.settings.isSoundMuted = true;
                this.game.settings.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            });
        }
    }
    playInitLossSound() {
        if (!this.game.settings.isSoundMuted) {
            this.initLossSound.currentTime = 0;
            this.initLossSound.play().catch((err: unknown) => {
                if (err instanceof Error) console.error(err.message);
                this.game.settings.isSoundMuted = true;
                this.game.settings.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            });
        }
    }
    shuffleCards() {
        if (this.game.settings.drawDelay !== 0) {
            setTimeout(() => {
                this.shuffleModal.close();
            }, 4000);
        }
        this.cards = [];
        this.playShuffleSound();
        for (let i = 0; i < this.game.settings.numberOfDecks; i++) {
            this.#generateDeck();
        }
        this.updateShoe();
    }
    updateShoe() {
        this.game.table.shoeMeter.value = this.cards.length;
        this.game.table.shoeMeter.textContent = this.cards.length.toString(10);
        this.game.table.cardsRemaining.textContent =
            this.cards.length.toString(10);
    }
}
