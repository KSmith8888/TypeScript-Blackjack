import { Card } from './card.js';

class Dealer {
    hand: Card[];
    total: number;
    aceOverage: number;
    cardElements: HTMLElement[];
    constructor() {
        this.hand = [];
        this.total = 0;
        this.aceOverage = 0;
        this.cardElements = [];
    }
}

export { Dealer };