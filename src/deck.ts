import Game from "./index.ts";
import Card from "./card.ts";

import cardAudioSrc from "../assets/audio/deal-card-sound.wav";
import shuffleAudioSrc from "../assets/audio/cardShuffle.wav";
//this.#ranks = ["A","A","A","A","A","A","A",8,9,10,"J","Q","K",];
//this.#ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
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
        this.#ranks = [
            "A",
            "A",
            "A",
            "A",
            "A",
            "A",
            "A",
            8,
            9,
            10,
            "J",
            "Q",
            "K",
        ];
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
        if (!this.game.settings.isSoundMuted) {
            this.#dealCardSound.currentTime = 0;
            this.#dealCardSound.play().catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
        }
    }
    playShuffleSound() {
        if (!this.game.settings.isSoundMuted) {
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
