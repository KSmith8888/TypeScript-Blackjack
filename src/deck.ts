import Card from "./card.js";
//this.ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
export default class Deck {
    cards: Card[];
    suits: string[];
    ranks: (number | string)[];
    constructor() {
        this.cards = [];
        this.suits = ["Hearts", "Clubs", "Spades", "Diamonds"];
        this.ranks = ["A"];
    }
    createCard(suit: string, rank: string | number): Card {
        return new Card(suit, rank);
    }
    generateDeck(): void {
        this.cards = [];
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                this.cards.push(this.createCard(suit, rank));
            }
        }
    }
    getCardIndex(): number {
        const randomNumber: number = Math.floor(
            Math.random() * this.cards.length
        );
        return randomNumber;
    }
}
