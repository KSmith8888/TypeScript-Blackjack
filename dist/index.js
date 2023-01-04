"use strict";
class Player {
    constructor(game) {
        this.hand = [];
        this.cardElements = [];
        this.total = 0;
        this.money = 100;
        this.currentBet = 0;
        this.totalMoneyText = document.querySelector('#total-money-text');
        this.bet5Btn = document.querySelector('#bet-5-button');
        this.bet10Btn = document.querySelector('#bet-10-button');
        this.bet25Btn = document.querySelector('#bet-25-button');
        this.bet50Btn = document.querySelector('#bet-50-button');
        this.game = game;
        this.bet5Btn.addEventListener('click', () => {
            this.currentBet = 5;
            this.money -= 5;
            this.disableBets();
        });
        this.bet10Btn.addEventListener('click', () => {
            this.currentBet = 10;
            this.money -= 10;
            this.disableBets();
        });
        this.bet25Btn.addEventListener('click', () => {
            this.currentBet = 25;
            this.money -= 25;
            this.disableBets();
        });
        this.bet50Btn.addEventListener('click', () => {
            this.currentBet = 50;
            this.money -= 50;
            this.disableBets();
        });
    }
    disableBets() {
        this.bet5Btn.disabled = true;
        this.bet10Btn.disabled = true;
        this.bet25Btn.disabled = true;
        this.bet50Btn.disabled = true;
        this.totalMoneyText.textContent = this.money.toString();
        this.game.activateSelections();
    }
    activateBets() {
        this.bet5Btn.disabled = false;
        this.bet10Btn.disabled = false;
        this.bet25Btn.disabled = false;
        this.bet50Btn.disabled = false;
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
        this.player = new Player(this);
        this.dealer = new Dealer();
        this.playerScoreText = document.querySelector('#player-score');
        this.playerSection = document.querySelector('#player-section');
        this.dealerScoreText = document.querySelector('#dealer-score');
        this.dealerSection = document.querySelector('#dealer-section');
        this.selectionsSection = document.querySelector('#selections-section');
        this.hitButton = document.querySelector('#hit-button');
        this.stayButton = document.querySelector('#stay-button');
        this.doubleDownBtn = document.querySelector('#double-down-button');
        this.gameResultText = document.querySelector('#game-result-text');
        this.dealerFaceDownCard = document.querySelector('#dealer-face-down-card');
        if (this.hitButton) {
            this.hitButton.addEventListener('click', () => {
                this.drawPlayerCard();
            });
        }
        if (this.stayButton) {
            this.stayButton.addEventListener('click', () => {
                this.initiateDealerTurn();
            });
        }
        if (this.doubleDownBtn) {
            this.doubleDownBtn.addEventListener('click', () => {
                this.player.money -= this.player.currentBet;
                this.player.currentBet = (this.player.currentBet * 2);
                this.player.totalMoneyText.textContent = this.player.money.toString();
                this.drawPlayerCard();
                if (this.player.total <= 21) {
                    this.initiateDealerTurn();
                }
            });
        }
    }
    startNewGame() {
        if (this.dealerFaceDownCard !== null) {
            this.dealerFaceDownCard.style.display = 'block';
        }
        this.player.total = 0;
        this.dealer.total = 0;
        this.player.currentBet = 0;
        this.player.hand = [];
        this.dealer.hand = [];
        this.deck.generateDeck();
        this.drawPlayerCard();
        this.drawPlayerCard();
        this.drawDealerCard();
        this.player.activateBets();
        this.disableSelections();
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
            if (this.player.total > 21) {
                this.checkTotals();
            }
        }
        else if (currentTurn === this.dealer) {
            if (this.dealerScoreText !== null) {
                this.dealerScoreText.textContent = this.dealer.total.toString();
            }
        }
    }
    initiateDealerTurn() {
        if (this.dealerFaceDownCard !== null) {
            this.dealerFaceDownCard.style.display = 'none';
        }
        this.disableSelections();
        do {
            this.drawDealerCard();
        } while (this.dealer.total < 17);
        this.checkTotals();
    }
    resetBoard(startNewGameBtn) {
        this.player.cardElements.forEach((card) => {
            card.remove();
        });
        this.dealer.cardElements.forEach((card) => {
            card.remove();
        });
        startNewGameBtn.remove();
        if (this.gameResultText) {
            this.gameResultText.textContent = '';
        }
    }
    activateSelections() {
        if (this.hitButton && this.stayButton && this.doubleDownBtn) {
            this.hitButton.disabled = false;
            this.stayButton.disabled = false;
            this.doubleDownBtn.disabled = false;
        }
    }
    disableSelections() {
        if (this.hitButton && this.stayButton && this.doubleDownBtn) {
            this.hitButton.disabled = true;
            this.stayButton.disabled = true;
            this.doubleDownBtn.disabled = true;
        }
    }
    drawPlayerCard() {
        if (this.doubleDownBtn) {
            this.doubleDownBtn.disabled = true;
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        this.player.hand.push(newCard);
        this.getRankValue(newCard.rank, this.player);
        const cardContainer = document.createElement('div');
        this.player.cardElements.push(cardContainer);
        if (this.playerSection !== null) {
            this.playerSection.append(cardContainer);
            cardContainer.classList.add('card-container');
            const cardRankTop = document.createElement('p');
            cardRankTop.textContent = newCard.rank.toString();
            cardRankTop.classList.add('card-rank-top');
            const cardSuit = document.createElement('img');
            cardSuit.src = `./assets/images/${newCard.suit}.png`;
            cardSuit.alt = newCard.suit;
            cardSuit.classList.add('card-suit');
            const cardRankBottom = document.createElement('p');
            cardRankBottom.textContent = newCard.rank.toString();
            cardRankBottom.classList.add('card-rank-bottom');
            cardContainer.append(cardRankTop);
            cardContainer.append(cardSuit);
            cardContainer.append(cardRankBottom);
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
            const cardRankTop = document.createElement('p');
            cardRankTop.textContent = newCard.rank.toString();
            cardRankTop.classList.add('card-rank-top');
            const cardSuit = document.createElement('img');
            cardSuit.src = `./assets/images/${newCard.suit}.png`;
            cardSuit.alt = newCard.suit;
            cardSuit.classList.add('card-suit');
            const cardRankBottom = document.createElement('p');
            cardRankBottom.textContent = newCard.rank.toString();
            cardRankBottom.classList.add('card-rank-bottom');
            cardContainer.append(cardRankTop);
            cardContainer.append(cardSuit);
            cardContainer.append(cardRankBottom);
        }
        this.deck.cards.splice(index, 1);
    }
    checkTotals() {
        if (this.player.total > 21) {
            this.endGame('You lose, better luck next time!');
        }
        else if (this.dealer.total > 21) {
            this.player.money += (this.player.currentBet * 2);
            this.endGame('You win, well done!');
        }
        else {
            if (this.player.total > this.dealer.total) {
                this.player.money += (this.player.currentBet * 2);
                this.endGame('You win, well done!');
            }
            else if (this.player.total === this.dealer.total) {
                this.player.money += (this.player.currentBet);
                this.endGame('Push. Try again?');
            }
            else {
                this.endGame('You lose, better luck next time!');
            }
        }
        this.player.totalMoneyText.textContent = this.player.money.toString();
    }
    endGame(resultText) {
        if (this.hitButton && this.stayButton && this.gameResultText && this.doubleDownBtn) {
            this.disableSelections();
            this.gameResultText.textContent = resultText;
        }
        const startNewGameBtn = document.createElement('button');
        startNewGameBtn.textContent = 'Start New Game';
        startNewGameBtn.classList.add('start-new-game-btn');
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
