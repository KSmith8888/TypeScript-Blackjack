import Card from "./card.js";

export default class Dealer {
    hand: Card[];
    total: number;
    aceOverage: number;
    constructor() {
        this.hand = [];
        this.total = 0;
        this.aceOverage = 0;
    }
}
