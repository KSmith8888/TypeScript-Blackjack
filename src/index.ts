class Player {
    hand: Card[];
    total: number;
    constructor() {
        this.hand = [];
        this.total = 0;
    }
}

class Dealer {
    hand: object[];
    total: number;
    constructor() {
        this.hand = [];
        this.total = 0;
    }
}

class Card {
    suit: string;
    rank: (string|number);
    constructor(suit: string, rank: (string|number)) {
        this.suit = suit;
        this.rank = rank;
    }
}

class Deck {
    cards: Card[];
    suits: string[];
    ranks: (number|string)[];
    constructor() {
        this.cards = [];
        this.suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
        this.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
    }
    createCard(suit: string, rank: (string|number)) {
        return new Card(suit, rank);
    }
    generateDeck() {
        for(const suit of this.suits) {
            for(const rank of this.ranks) {
                this.cards.push(this.createCard(suit, rank))
            }
        }
    }
    getCardIndex() {
        const randomNumber: number = Math.floor(Math.random() * this.cards.length) + 1;
        return randomNumber;
    }
}

class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    playerScoreText: (HTMLParagraphElement|null);
    playerSection: (HTMLElement|null);
    dealerScoreText: (HTMLElement|null);
    dealerSection: (HTMLElement|null);
    hitButton: (HTMLButtonElement|null);
    stayButton: (HTMLButtonElement|null);
    constructor() {
        this.deck = new Deck();
        this.player = new Player();
        this.dealer = new Dealer();
        this.playerScoreText = document.querySelector('#player-score');
        this.playerSection = document.querySelector('#player-section');
        this.dealerScoreText = document.querySelector('#dealer-score');
        this.dealerSection = document.querySelector('#dealer-section');
        this.hitButton = document.querySelector('#hit-button');
        this.stayButton = document.querySelector('#stay-button');
        if(this.hitButton !== null) {
            this.hitButton.addEventListener('click', () => {
                this.drawPlayerCard();
            });
        }
        if(this.stayButton !== null) {
            this.stayButton.addEventListener('click', () => {
                console.log('clicked stay');
            })
        }
    }
    startNewGame() {
        this.deck.generateDeck();
        this.drawPlayerCard();
        this.drawPlayerCard();
        const dealerFaceDownCard: HTMLDivElement = document.createElement('div');
        dealerFaceDownCard.classList.add('card-container');
        if(this.dealerSection !== null) {
            this.dealerSection?.append(dealerFaceDownCard);
        }
        this.drawDealerCard();
    }
    getRankValue(rank: (string|number), currentTurn: (Player|Dealer)) {
        /*
        If the rank is 2-10, add the rank to the total. If the rank is Jack, Queen, or King add 10. If the rank is Ace and adding 11 would bust, then add 1, otherwise add 11
        */
        const numericValueRank: number = typeof rank === 'number' ? rank : 0;
        switch (rank) {
            case 'A':
                (currentTurn.total + 11) > 21 ?  currentTurn.total += 1 : currentTurn.total += 11;
                break;
            case 'K':
            case 'Q':
            case 'J':
                currentTurn.total += 10;
                break;
            default: currentTurn.total += numericValueRank;
        }
        if(currentTurn === this.player) {
            if (this.playerScoreText !== null) {
                this.playerScoreText.textContent = this.player.total.toString();
            }
        } else if(currentTurn === this.dealer) {
            if (this.dealerScoreText !== null) {
                this.dealerScoreText.textContent = this.dealer.total.toString();
            }
        }
    }
    drawPlayerCard() {
        const index: number = this.deck.getCardIndex();
        const newCard: Card = this.deck.cards[index];
        this.player.hand.push(newCard);
        this.getRankValue(newCard.rank, this.player)
        const cardContainer: HTMLDivElement = document.createElement('div');
        if(this.playerSection !== null) {
            this.playerSection.append(cardContainer);
            cardContainer.classList.add('card-container');
            const cardSuit: HTMLParagraphElement = document.createElement('p');
            cardSuit.textContent = newCard.suit;
            cardSuit.classList.add('card-suit');
            const cardRank: HTMLParagraphElement = document.createElement('p');
            cardRank.textContent = newCard.rank.toString();
            cardRank.classList.add('card-rank');
            cardContainer.append(cardSuit);
            cardContainer.append(cardRank);
        }
        this.deck.cards.splice(index, 1);
    }
    drawDealerCard() {
        const index: number = this.deck.getCardIndex();
        const newCard: Card = this.deck.cards[index];
        this.dealer.hand.push(newCard);
        this.getRankValue(newCard.rank, this.dealer)
        const cardContainer: HTMLDivElement = document.createElement('div');
        if(this.dealerSection !== null) {
            this.dealerSection.append(cardContainer);
            cardContainer.classList.add('card-container');
            const cardSuit: HTMLParagraphElement = document.createElement('p');
            cardSuit.textContent = newCard.suit;
            cardSuit.classList.add('card-suit');
            const cardRank: HTMLParagraphElement = document.createElement('p');
            cardRank.textContent = newCard.rank.toString();
            cardRank.classList.add('card-rank');
            cardContainer.append(cardSuit);
            cardContainer.append(cardRank);
        }
        this.deck.cards.splice(index, 1);
    }
}

const game = new Game();
game.startNewGame();
