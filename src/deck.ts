import Game from "./index.js";
import Card from "./card.js";

import cardAudioSrc from "../assets/audio/deal-card-sound.wav";
import shuffleAudioSrc from "../assets/audio/cardShuffle.wav";

export default class Deck {
    game: Game;
    cards: Card[];
    #suits: string[];
    #ranks: (number | string)[];
    #dealCardSound: HTMLAudioElement;
    #shuffleSound: HTMLAudioElement;
    constructor(game: Game) {
        this.game = game;
        this.cards = [];
        this.#suits = ["Hearts", "Clubs", "Spades", "Diamonds"];
        this.#ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
        this.#dealCardSound = new Audio(cardAudioSrc);
        this.#dealCardSound.volume = 0.5;
        this.#shuffleSound = new Audio(shuffleAudioSrc);
        this.#shuffleSound.volume = 0.5;
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
        if (!this.game.isSoundMuted) {
            this.#dealCardSound.play().catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
        }
    }
    playShuffleSound() {
        if (!this.game.isSoundMuted) {
            this.#shuffleSound.play().catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
        }
    }
    shuffleCards() {
        this.cards = [];
        //this.playShuffleSound();
        if (this.game.numberOfDecks >= 1 && this.game.numberOfDecks < 9) {
            for (let i = 0; i < this.game.numberOfDecks; i++) {
                this.#generateDeck();
            }
        } else {
            this.game.numberOfDecks = 1;
            this.#generateDeck();
        }
    }
    updateShoe() {
        this.game.table.shoeMeter.value = this.cards.length;
        this.game.table.shoeMeter.textContent = this.cards.length.toString(10);
        this.game.table.cardsRemaining.textContent =
            this.cards.length.toString(10);
    }
}
