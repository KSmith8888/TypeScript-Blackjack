import Card from "./card";

export default class Hand {
    cards: Card[];
    total: number;
    bet: number;
    aceOverage: number;
    hasBeenDoubled: boolean;
    result: null | string;
    constructor(betAmount: number) {
        this.cards = [];
        this.total = 0;
        this.bet = betAmount;
        this.aceOverage = 0;
        this.hasBeenDoubled = false;
        this.result = null;
    }
}
