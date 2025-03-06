import Game from "./index.ts";
import Card from "./card.ts";

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
        this.game.deck.playFlipSound();
        setTimeout(() => {
            this.game.table.dealerFaceDownCard.classList.add("hidden");
            const hiddenDealerCard = this.hand[1];
            this.game.table.renderCard(
                "Dealer",
                hiddenDealerCard.rank,
                hiddenDealerCard.suit
            );
            this.game.table.dealerScoreText.textContent = this.total.toString();
        }, this.game.settings.drawDelay);
    }
    startTurn() {
        const continueDrawing = setInterval(() => {
            const soft17Hit =
                this.aceOverage > 0 && this.game.settings.hitOnSoft17;
            if (this.total < 17 || (this.total === 17 && soft17Hit)) {
                this.game.deck.playCardSound();
                this.drawCard(false);
            } else {
                clearInterval(continueDrawing);
                this.game.endRound();
            }
        }, this.game.settings.drawDelay);
    }
}
