import Card from "./card";

export default class Hand {
    cards: Card[];
    total: number;
    aceOverage: number;
    hasBeenDoubled: boolean;
    result: null | string;
    constructor() {
        this.cards = [];
        this.total = 0;
        this.aceOverage = 0;
        this.hasBeenDoubled = false;
        this.result = null;
    }
}
