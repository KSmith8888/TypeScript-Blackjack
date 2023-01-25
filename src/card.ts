class Card {
    suit: string;
    rank: (string|number);
    constructor(suit: string, rank: (string|number)) {
        this.suit = suit;
        this.rank = rank;
    }
}

export { Card };