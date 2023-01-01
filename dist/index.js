"use strict";
class Player {
    constructor() {
        this.hand = [];
        this.cardElements = [];
        this.total = 0;
    }
}
class Dealer {
    constructor() {
        this.hand = [];
        this.total = 0;
        this.cardElements = [];
    }
}
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
}
class Deck {
    constructor() {
        this.cards = [];
        this.suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
        this.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
    }
    createCard(suit, rank) {
        return new Card(suit, rank);
    }
    generateDeck() {
        this.cards = [];
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                this.cards.push(this.createCard(suit, rank));
            }
        }
    }
    getCardIndex() {
        const randomNumber = Math.floor(Math.random() * this.cards.length);
        return randomNumber;
    }
}
class Game {
    constructor() {
        this.deck = new Deck();
        this.player = new Player();
        this.dealer = new Dealer();
        this.playerScoreText = document.querySelector('#player-score');
        this.playerSection = document.querySelector('#player-section');
        this.dealerScoreText = document.querySelector('#dealer-score');
        this.dealerSection = document.querySelector('#dealer-section');
        this.selectionsSection = document.querySelector('#selections-section');
        this.hitButton = document.querySelector('#hit-button');
        this.stayButton = document.querySelector('#stay-button');
        this.gameResultText = document.querySelector('#game-result-text');
        this.dealerFaceDownCard = document.querySelector('#dealer-face-down-card');
        if (this.hitButton !== null) {
            this.hitButton.addEventListener('click', () => {
                this.drawPlayerCard();
            });
        }
        if (this.stayButton !== null) {
            this.stayButton.addEventListener('click', () => {
                this.initiateDealerTurn();
            });
        }
    }
    startNewGame() {
        if (this.dealerFaceDownCard !== null) {
            this.dealerFaceDownCard.style.display = 'block';
        }
        this.player.total = 0;
        this.dealer.total = 0;
        this.player.hand = [];
        this.dealer.hand = [];
        this.deck.generateDeck();
        this.drawPlayerCard();
        this.drawPlayerCard();
        this.drawDealerCard();
    }
    getRankValue(rank, currentTurn) {
        const numericValueRank = typeof rank === 'number' ? rank : 0;
        console.log(rank, numericValueRank);
        switch (rank) {
            case 'A':
                (currentTurn.total + 11) > 21 ? currentTurn.total += 1 : currentTurn.total += 11;
                break;
            case 'K':
            case 'Q':
            case 'J':
                currentTurn.total += 10;
                break;
            default: currentTurn.total += numericValueRank;
        }
        if (currentTurn === this.player) {
            if (this.playerScoreText !== null) {
                this.playerScoreText.textContent = this.player.total.toString();
            }
        }
        else if (currentTurn === this.dealer) {
            if (this.dealerScoreText !== null) {
                this.dealerScoreText.textContent = this.dealer.total.toString();
            }
        }
        this.checkTotals(currentTurn);
    }
    initiateDealerTurn() {
        if (this.dealerFaceDownCard !== null) {
            this.dealerFaceDownCard.style.display = 'none';
        }
        if (this.stayButton !== null && this.hitButton !== null) {
            this.hitButton.disabled = true;
            this.stayButton.disabled = true;
        }
        if (this.dealer.total < 17) {
            this.drawDealerCard();
        }
    }
    resetBoard(startNewGameBtn) {
        this.player.cardElements.forEach((card) => {
            card.remove();
        });
        this.dealer.cardElements.forEach((card) => {
            card.remove();
        });
        startNewGameBtn.remove();
        if (this.hitButton && this.stayButton && this.gameResultText) {
            this.hitButton.disabled = false;
            this.stayButton.disabled = false;
            this.gameResultText.textContent = '';
        }
    }
    drawPlayerCard() {
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        this.player.hand.push(newCard);
        this.getRankValue(newCard.rank, this.player);
        const cardContainer = document.createElement('div');
        this.player.cardElements.push(cardContainer);
        if (this.playerSection !== null) {
            this.playerSection.append(cardContainer);
            cardContainer.classList.add('card-container');
            const cardSuit = document.createElement('p');
            cardSuit.textContent = newCard.suit;
            cardSuit.classList.add('card-suit');
            const cardRank = document.createElement('p');
            cardRank.textContent = newCard.rank.toString();
            cardRank.classList.add('card-rank');
            cardContainer.append(cardSuit);
            cardContainer.append(cardRank);
        }
        this.deck.cards.splice(index, 1);
    }
    drawDealerCard() {
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        this.dealer.hand.push(newCard);
        this.getRankValue(newCard.rank, this.dealer);
        const cardContainer = document.createElement('div');
        this.dealer.cardElements.push(cardContainer);
        if (this.dealerSection !== null) {
            this.dealerSection.append(cardContainer);
            cardContainer.classList.add('card-container');
            const cardSuit = document.createElement('p');
            cardSuit.textContent = newCard.suit;
            cardSuit.classList.add('card-suit');
            const cardRank = document.createElement('p');
            cardRank.textContent = newCard.rank.toString();
            cardRank.classList.add('card-rank');
            cardContainer.append(cardSuit);
            cardContainer.append(cardRank);
        }
        this.deck.cards.splice(index, 1);
    }
    checkTotals(currentTurn) {
        if (currentTurn === this.player) {
            if (this.player.total > 21) {
                this.endGame('You lose, better luck next time!');
            }
        }
        if (currentTurn === this.dealer) {
            if (this.dealer.total > 21) {
                this.endGame('You win, well done!');
            }
        }
    }
    endGame(resultText) {
        if (this.hitButton !== null && this.stayButton !== null && this.gameResultText !== null) {
            this.hitButton.disabled = true;
            this.stayButton.disabled = true;
            this.gameResultText.textContent = resultText;
        }
        const startNewGameBtn = document.createElement('button');
        startNewGameBtn.textContent = 'Start New Game';
        if (this.selectionsSection !== null) {
            this.selectionsSection.append(startNewGameBtn);
            startNewGameBtn.addEventListener('click', () => {
                this.resetBoard(startNewGameBtn);
                this.startNewGame();
            });
        }
    }
}
const game = new Game();
game.startNewGame();
