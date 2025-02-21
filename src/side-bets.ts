import Game from "./index.ts";
import Card from "./card.ts";

export default class SideBets {
    game: Game;
    currentIndexes: number[];
    resetCount: number;
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
        this.currentIndexes = [];
        this.resetCount = Math.floor(Math.random() * 10) + 1;
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
            {
                payout: 150,
                description: "Both cards are hearts",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Hearts" &&
                        cards[1].suit === "Hearts"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 150,
                description: "Both cards are diamonds",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Diamonds" &&
                        cards[1].suit === "Diamonds"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 150,
                description: "Both cards are clubs",
                didWin: (cards: Card[]) => {
                    if (cards[0].suit === "Clubs" && cards[1].suit === "Clubs")
                        return true;
                    else return false;
                },
            },
        ];
    }
    countdown() {
        this.resetCount -= 1;
        if (this.resetCount <= 0) {
            this.resetBets();
            this.resetCount = Math.floor(Math.random() * 10) + 1;
        }
    }
    resetIndexes() {
        const indexSet: Set<number> = new Set();
        while (indexSet.size < 3) {
            indexSet.add(Math.floor(Math.random() * this.bets.length));
        }
        this.currentIndexes = Array.from(indexSet);
    }
    resetBets() {
        this.game.sideBetsMenu.currentBetsList.replaceChildren();
        this.game.sideBetsMenu.openSideBetsBtn.classList.add("change-color");
        this.resetIndexes();
        this.currentIndexes.forEach((index) => {
            const itemText = `Condition: ${this.bets[index].description}`;
            const description = document.createElement("li");
            description.textContent = itemText;
            description.classList.add("side-bet-list-item");
            this.game.sideBetsMenu.currentBetsList.append(description);
            const subList = document.createElement("ul");
            subList.classList.add("side-bet-sub-list");
            description.append(subList);
            const payout = document.createElement("li");
            payout.textContent = `Payout: ${this.bets[index].payout.toString(
                10
            )}/1`;
            payout.classList.add("side-bet-list-item");
            subList.append(payout);
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
