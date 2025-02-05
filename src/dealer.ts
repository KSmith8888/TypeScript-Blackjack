import Game from "./index.js";
import Card from "./card.js";

export default class Dealer {
    game: Game;
    hand: Card[];
    total: number;
    aceOverage: number;
    holeCardRevealed: boolean;
    constructor(game: Game) {
        this.game = game;
        this.hand = [];
        this.total = 0;
        this.aceOverage = 0;
        this.holeCardRevealed = false;
    }
    drawCard(hidden: boolean) {
        const index = this.game.deck.getCardIndex();
        const newCard = this.game.deck.cards[index];
        this.hand.push(newCard);
        const result = this.game.getRankValue(newCard.rank, this.total);
        this.total += result.value;
        if (result.aceOverage) this.aceOverage += 10;
        if (this.total > 21) {
            if (this.aceOverage > 0) {
                this.total -= 10;
                this.aceOverage -= 10;
            }
        }
        if (this.hand.length >= 3) {
            this.game.table.dealerScoreText.textContent = this.total.toString();
        }
        if (!hidden)
            this.game.table.renderCard("Dealer", newCard.rank, newCard.suit);
        this.game.deck.cards.splice(index, 1);
        this.game.deck.updateShoe();
    }
    revealHoleCard() {
        this.holeCardRevealed = true;
        this.game.deck.playCardSound();
        setTimeout(() => {
            this.game.table.dealerFaceDownCard.style.display = "none";
            const hiddenDealerCard = this.hand[1];
            this.game.table.renderCard(
                "Dealer",
                hiddenDealerCard.rank,
                hiddenDealerCard.suit
            );
            this.game.table.dealerScoreText.textContent = this.total.toString();
        }, 500);
    }
    startTurn() {
        const continueDrawing = setInterval(() => {
            const soft17Hit = this.aceOverage > 0 && this.game.hitOnSoft17;
            if (this.total < 17 || soft17Hit) {
                this.game.deck.playCardSound();
                this.drawCard(false);
            } else {
                clearInterval(continueDrawing);
                this.game.endRound();
            }
        }, 1000);
    }
}
