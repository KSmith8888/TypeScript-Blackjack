import Card from "./card.ts";

export default class Hand {
    cards: Card[];
    total: number;
    aceOverage: number;
    hasBeenDoubled: boolean;
    result: null | string;
    resultText: null | string;
    constructor() {
        this.cards = [];
        this.total = 0;
        this.aceOverage = 0;
        this.hasBeenDoubled = false;
        this.result = null;
        this.resultText = null;
    }
}
