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
        isActive: boolean;
        didWin: (cards: Card[]) => boolean;
    }[];
    constructor(game: Game) {
        this.game = game;
        this.currentIndexes = [];
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
                isActive: false,
                didWin: (cards: Card[]) => {
                    if (cards[0].rank === 4 && cards[1].rank === 4) return true;
                    else return false;
                },
            },
            {
                payout: 200,
                description: "Both cards are aces",
                isActive: false,
                didWin: (cards: Card[]) => {
                    if (cards[0].rank === "A" && cards[1].rank === "A")
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "One card is a Jack and the other is an ace",
                isActive: false,
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
                isActive: false,
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
                isActive: false,
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
                isActive: false,
                didWin: (cards: Card[]) => {
                    if (cards[0].suit === "Clubs" && cards[1].suit === "Clubs")
                        return true;
                    else return false;
                },
            },
        ];
    }
    resetIndexes() {
        const newIndexes: number[] = [];
        this.bets.forEach((bet, index) => {
            if (!bet.isActive && newIndexes.length < 3) newIndexes.push(index);
        });
        this.bets.forEach((bet) => (bet.isActive = false));
        newIndexes.forEach((index) => (this.bets[index].isActive = true));
        this.currentIndexes = newIndexes;
    }
    resetBets() {
        this.game.sideBetsMenu.currentBetsList.replaceChildren();
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
