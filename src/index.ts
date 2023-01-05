class Player {
    hand: Card[];
    total: number;
    cardElements: HTMLElement[];
    money: number;
    currentBet: number;
    aceOverage: number;
    bet5Btn: HTMLButtonElement;
    bet10Btn: HTMLButtonElement;
    bet25Btn: HTMLButtonElement;
    bet50Btn: HTMLButtonElement;
    totalMoneyText: HTMLSpanElement;
    game: Game;
    constructor(game: Game) {
        this.hand = [];
        this.cardElements = [];
        this.total = 0;
        this.money = 100;
        this.currentBet = 0;
        this.aceOverage = 0;
        this.totalMoneyText = document.querySelector('#total-money-text') as HTMLSpanElement;
        this.bet5Btn = document.querySelector('#bet-5-button') as HTMLButtonElement;
        this.bet10Btn = document.querySelector('#bet-10-button') as HTMLButtonElement;
        this.bet25Btn = document.querySelector('#bet-25-button') as HTMLButtonElement;
        this.bet50Btn = document.querySelector('#bet-50-button') as HTMLButtonElement;
        this.game = game;
        this.bet5Btn.addEventListener('click', () => {
            if(this.money >= 5) {
                this.currentBet = 5;
                this.money -= 5;
                this.disableBets();
            }
        });
        this.bet10Btn.addEventListener('click', () => {
            if(this.money >= 10) {
                this.currentBet = 10;
                this.money -= 10;
                this.disableBets();
            }
        });
        this.bet25Btn.addEventListener('click', () => {
            if(this.money >= 25) {
                this.currentBet = 25;
                this.money -= 25;
                this.disableBets();
            }
        });
        this.bet50Btn.addEventListener('click', () => {
            if(this.money >= 50) {
                this.currentBet = 50;
                this.money -= 50;
                this.disableBets();
            }
        });
    }
    disableBets(): void {
        this.bet5Btn.disabled = true;
        this.bet10Btn.disabled = true;
        this.bet25Btn.disabled = true;
        this.bet50Btn.disabled = true;
        this.totalMoneyText.textContent = this.money.toString();
        this.game.activateSelections();
    }
    activateBets(): void {
        this.bet5Btn.disabled = false;
        this.bet10Btn.disabled = false;
        this.bet25Btn.disabled = false;
        this.bet50Btn.disabled = false;
    }
}

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
    createCard(suit: string, rank: (string|number)): Card {
        return new Card(suit, rank);
    }
    generateDeck(): void {
        this.cards = [];
        for(const suit of this.suits) {
            for(const rank of this.ranks) {
                this.cards.push(this.createCard(suit, rank))
            }
        }
    }
    getCardIndex(): number {
        const randomNumber: number = Math.floor(Math.random() * this.cards.length);
        return randomNumber;
    }
}

class Game {
    deck: Deck;
    player: Player;
    dealer: Dealer;
    playerScoreText: (HTMLSpanElement|null);
    playerSection: (HTMLElement|null);
    dealerScoreText: (HTMLSpanElement|null);
    dealerSection: (HTMLElement|null);
    dealerFaceDownCard: (HTMLDivElement|null);
    scoresContainer: (HTMLElement|null);
    hitButton: (HTMLButtonElement|null);
    stayButton: (HTMLButtonElement|null);
    doubleDownBtn: (HTMLButtonElement|null);
    gameResultText: (HTMLParagraphElement|null);
    constructor() {
        this.deck = new Deck();
        this.player = new Player(this);
        this.dealer = new Dealer();
        this.playerScoreText = document.querySelector('#player-score');
        this.playerSection = document.querySelector('#player-section');
        this.dealerScoreText = document.querySelector('#dealer-score');
        this.dealerSection = document.querySelector('#dealer-section');
        this.scoresContainer = document.querySelector('#scores-container');
        this.hitButton = document.querySelector('#hit-button');
        this.stayButton = document.querySelector('#stay-button');
        this.doubleDownBtn = document.querySelector('#double-down-button');
        this.gameResultText = document.querySelector('#game-result-text');
        this.dealerFaceDownCard = document.querySelector('#dealer-face-down-card');
        this.hitButton?.addEventListener('click', () => {
            this.drawCard(this.player, this.playerSection);
        });
        this.stayButton?.addEventListener('click', () => {
            this.initiateDealerTurn();
        });
        this.doubleDownBtn?.addEventListener('click', () => {
            if(this.player.money >= this.player.currentBet) {
                this.player.money -= this.player.currentBet;
                this.player.currentBet = (this.player.currentBet * 2);
                this.player.totalMoneyText.textContent = this.player.money.toString();
                this.drawCard(this.player, this.playerSection);
            if(this.player.total <= 21) {
                this.initiateDealerTurn();
            }
            }
        });
    }
    startNewGame(): void {
        if(this.dealerFaceDownCard !== null) {
            this.dealerFaceDownCard.style.display = 'block';
        }
        this.player.total = 0;
        this.dealer.total = 0;
        this.player.currentBet = 0;
        this.player.hand = [];
        this.dealer.hand = [];
        this.deck.generateDeck();
        this.drawCard(this.player, this.playerSection);
        this.drawCard(this.player, this.playerSection);
        this.drawCard(this.dealer, this.dealerSection);
        this.player.activateBets();
        this.disableSelections();
    }
    getRankValue(rank: (string|number), currentTurn: (Player|Dealer)): void {
        /*
        If the rank is 2-10, add the rank to the total. If the rank is Jack, Queen, or King add 10. If the rank is Ace and adding 11 would bust, then add 1, otherwise add 11
        */
        const numericValueRank: number = typeof rank === 'number' ? rank : 0;
        switch (rank) {
            case 'A':
                if((currentTurn.total + 11) > 21) { 
                    currentTurn.total += 1
                } else {
                    currentTurn.total += 11;
                    currentTurn.aceOverage += 10;
                }
                break;
            case 'K':
            case 'Q':
            case 'J':
                currentTurn.total += 10;
                break;
            default: currentTurn.total += numericValueRank;
        }
        if(this.player.total > 21 && this.player.aceOverage === 0 && currentTurn === this.player) {
            this.checkTotals();
        } else if(currentTurn.total > 21 && currentTurn.aceOverage > 0) {
            currentTurn.total -= 10;
            currentTurn.aceOverage -= 10;
        }
        if (this.playerScoreText && currentTurn === this.player) {
            this.playerScoreText.textContent = this.player.total.toString();
        } 
        if(this.dealerScoreText && currentTurn === this.dealer) {
            this.dealerScoreText.textContent = this.dealer.total.toString();
        }
    }
    initiateDealerTurn(): void {
        if(this.dealerFaceDownCard !== null) {
            this.dealerFaceDownCard.style.display = 'none';
        }
        this.disableSelections();
        do {
            this.drawCard(this.dealer, this.dealerSection);
        } while(this.dealer.total < 17);
        this.checkTotals();
    }
    resetBoard(startNewGameBtn: HTMLButtonElement): void {
        this.player.cardElements.forEach((card) => {
            card.remove();
        });
        this.dealer.cardElements.forEach((card) => {
            card.remove();
        });
        startNewGameBtn.remove();
        if(this.gameResultText) {
            this.gameResultText.textContent = '';
        }
    }
    activateSelections(): void {
        if(this.hitButton && this.stayButton && this.doubleDownBtn) {
            this.hitButton.disabled = false;
            this.stayButton.disabled = false;
            this.doubleDownBtn.disabled = false;
        }
    }
    disableSelections(): void {
        if(this.hitButton && this.stayButton && this.doubleDownBtn) {
            this.hitButton.disabled = true;
            this.stayButton.disabled = true;
            this.doubleDownBtn.disabled = true;
        }
    }
    drawCard(currentTurn: Player|Dealer, currentSection: HTMLElement|null): void {
        if(this.doubleDownBtn) {
            this.doubleDownBtn.disabled = true;
        }
        if(this.deck.cards.length < 1) {
            this.deck.generateDeck();
        }
        const index = this.deck.getCardIndex();
        const newCard = this.deck.cards[index];
        currentTurn.hand.push(newCard);
        this.getRankValue(newCard.rank, currentTurn);
        const cardContainer = document.createElement('div');
        currentTurn.cardElements.push(cardContainer);
        if (currentSection !== null) {
            currentSection.append(cardContainer);
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
    checkTotals(): void {
        if(this.player.total > 21) {
            this.endGame('You lose, better luck next time!');
        }else if(this.dealer.total > 21) {
            this.player.money += (this.player.currentBet * 2);
            this.endGame('You win, well done!');
        } else {
            if(this.player.total > this.dealer.total) {
                this.player.money += (this.player.currentBet * 2);
                this.endGame('You win, well done!');
            } else if(this.player.total === this.dealer.total) {
                this.player.money += (this.player.currentBet);
                this.endGame('Push. Try again?');
            } else {
                this.endGame('You lose, better luck next time!');
            }
        }
        this.player.totalMoneyText.textContent = this.player.money.toString();
    }
    endGame(resultText: string): void {
        if(this.hitButton && this.stayButton && this.gameResultText && this.doubleDownBtn) {
            this.disableSelections();
            this.gameResultText.textContent = resultText;
        }
        const startNewGameBtn = document.createElement('button');
        startNewGameBtn.textContent = 'Start New Game';
        startNewGameBtn.classList.add('start-new-game-btn');
        if(this.scoresContainer) {
            this.scoresContainer.append(startNewGameBtn);
            startNewGameBtn.addEventListener('click', () => {
                this.resetBoard(startNewGameBtn);
                this.startNewGame();
            });
        }
    }
}

const game = new Game();
game.startNewGame();
