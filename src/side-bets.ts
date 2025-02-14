import Game from "./index.ts";
import Card from "./card.ts";

export default class SideBets {
    game: Game;
    currentIndexes: number[];
    bets: {
        payout: number;
        description: string;
        didWin: (cards: Card[]) => boolean;
    }[];
    constructor(game: Game) {
        this.game = game;
        this.currentIndexes = [1, 2];
        this.bets = [
            {
                payout: 100,
                description: "Both cards are fours",
                didWin: (cards: Card[]) => {
                    if (cards[0].rank === 4 && cards[1].rank === 4) return true;
                    else return false;
                },
            },
            {
                payout: 200,
                description: "Both cards are aces",
                didWin: (cards: Card[]) => {
                    if (cards[0].rank === "A" && cards[1].rank === "A")
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "One card is a Jack and the other is an ace",
                didWin: (cards: Card[]) => {
                    if (cards[0].rank === "A" && cards[1].rank === "J")
                        return true;
                    else if (cards[0].rank === "J" && cards[1].rank === "A")
                        return true;
                    else return false;
                },
            },
        ];
    }
    resetBets() {
        this.game.sideBetsMenu.currentBetsList.replaceChildren();
        this.currentIndexes = [1, 2];
        this.currentIndexes.forEach((index) => {
            const itemText = this.bets[index].description;
            const listItem = document.createElement("li");
            listItem.textContent = itemText;
            listItem.classList.add("side-bet-list-item");
            this.game.sideBetsMenu.currentBetsList.append(listItem);
        });
    }
    checkForMatches(cards: Card[]) {
        this.currentIndexes.forEach((betIndex) => {
            const didWin = this.bets[betIndex].didWin(cards);
            if (didWin) {
                this.game.player.money += this.bets[betIndex].payout;
            }
            this.game.table.totalMoneyText.textContent = `$${this.game.player.money.toString(
                10
            )}`;
        });
    }
}
