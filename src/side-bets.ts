import Game from "./index.ts";
import Card from "./card.ts";

export default class SideBets {
    game: Game;
    currentIndexes: number[];
    wonSideBetModal: HTMLDialogElement;
    wonSideBetText: HTMLParagraphElement;
    wonSideBetPayout: HTMLParagraphElement;
    wonSideBetBtn: HTMLButtonElement;
    bets: {
        payout: number;
        description: string;
        didWin: (cards: Card[]) => boolean;
    }[];
    constructor(game: Game) {
        this.game = game;
        this.currentIndexes = [1, 2];
        this.wonSideBetModal = <HTMLDialogElement>(
            document.getElementById("won-side-bet-modal")
        );
        this.wonSideBetText = <HTMLParagraphElement>(
            document.getElementById("won-side-bet-text")
        );
        this.wonSideBetPayout = <HTMLParagraphElement>(
            document.getElementById("won-side-bet-payout")
        );
        this.wonSideBetBtn = <HTMLButtonElement>(
            document.getElementById("won-side-bet-button")
        );
        this.wonSideBetBtn.addEventListener("click", () => {
            this.wonSideBetModal.close();
        });
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
            const itemText = `Condition: ${this.bets[index].description}`;
            const description = document.createElement("li");
            description.textContent = itemText;
            description.classList.add("side-bet-list-item");
            this.game.sideBetsMenu.currentBetsList.append(description);
            const payout = document.createElement("li");
            payout.textContent = `Payout: ${this.bets[index].payout.toString(
                10
            )}/1`;
            payout.classList.add("side-bet-list-item");
            this.game.sideBetsMenu.currentBetsList.append(payout);
        });
    }
    wonSideBet(description: string, payout: number) {
        this.wonSideBetText.textContent = description;
        this.wonSideBetPayout.textContent = `Payout: ${payout.toString(
            10
        )}/1 - Bet amount: $${this.game.settings.sideBetAmount.toString(10)}`;
        this.game.player.money += payout * this.game.settings.sideBetAmount;
        this.game.table.totalMoneyText.textContent = `$${this.game.player.money.toString(
            10
        )}`;
        this.wonSideBetModal.showModal();
    }
    checkForMatches(cards: Card[]) {
        this.currentIndexes.forEach((betIndex) => {
            const didWin = this.bets[betIndex].didWin(cards);
            if (didWin) {
                this.wonSideBet(
                    this.bets[betIndex].description,
                    this.bets[betIndex].payout
                );
            }
        });
    }
}
