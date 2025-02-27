import Game from "./index.ts";
import Card from "./card.ts";

import wonSideBetSound from "../assets/audio/ui-sound-two.mp3";

export default class SideBets {
    game: Game;
    currentIndexes: number[];
    resetCount: number;
    wonSideBetModal: HTMLDialogElement;
    wonSideBetText: HTMLParagraphElement;
    wonSideBetPayout: HTMLParagraphElement;
    wonSideBetBtn: HTMLButtonElement;
    #wonSideBetSound: HTMLAudioElement;
    bets: {
        payout: number;
        description: string;
        didWin: (cards: Card[]) => boolean;
    }[];
    constructor(game: Game) {
        this.game = game;
        this.currentIndexes = [];
        this.resetCount = Math.floor(Math.random() * 20) + 5;
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
        this.#wonSideBetSound = new Audio(wonSideBetSound);
        this.#wonSideBetSound.volume = 0.3;
        this.bets = [
            {
                payout: 150,
                description: "Both cards are King of Hearts",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].rank === "K" &&
                        cards[0].suit === "Hearts" &&
                        cards[1].rank === "K" &&
                        cards[1].suit === "Hearts"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "Both cards are Ace of Diamonds",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].rank === "A" &&
                        cards[0].suit === "Diamonds" &&
                        cards[1].rank === "A" &&
                        cards[1].suit === "Diamonds"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 150,
                description:
                    "One card is a King of Clubs and the other is a Queen of Clubs",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Clubs" &&
                        cards[0].rank === "K" &&
                        cards[1].suit === "Clubs" &&
                        cards[1].rank === "Q"
                    )
                        return true;
                    else if (
                        cards[0].suit === "Clubs" &&
                        cards[0].rank === "Q" &&
                        cards[1].suit === "Clubs" &&
                        cards[1].rank === "K"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "Both cards are Eight of Hearts",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Hearts" &&
                        cards[0].rank === 8 &&
                        cards[1].suit === "Hearts" &&
                        cards[1].rank === 8
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 75,
                description: "Both cards are Four of Spades",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Spades" &&
                        cards[0].rank === 4 &&
                        cards[1].suit === "Spades" &&
                        cards[1].rank === 4
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "Both cards are Nine of clubs",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Clubs" &&
                        cards[0].rank === 9 &&
                        cards[1].suit === "Clubs" &&
                        cards[1].rank === 9
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "Both cards are Jack of Clubs",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Clubs" &&
                        cards[0].rank === "J" &&
                        cards[1].suit === "Clubs" &&
                        cards[1].rank === "J"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 200,
                description: "One Jack of Spades and one Ace of Hearts",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Spades" &&
                        cards[0].rank === "J" &&
                        cards[1].suit === "Hearts" &&
                        cards[1].rank === "A"
                    )
                        return true;
                    else if (
                        cards[0].suit === "Hearts" &&
                        cards[0].rank === "A" &&
                        cards[1].suit === "Spades" &&
                        cards[1].rank === "J"
                    )
                        return true;
                    else return false;
                },
            },
            {
                payout: 100,
                description: "Both cards are Ten of Diamonds",
                didWin: (cards: Card[]) => {
                    if (
                        cards[0].suit === "Diamonds" &&
                        cards[0].rank === 10 &&
                        cards[1].suit === "Diamonds" &&
                        cards[1].rank === 10
                    )
                        return true;
                    else return false;
                },
            },
        ];
    }
    countdown() {
        this.resetCount -= 1;
        this.game.sideBetsMenu.activeBetsText.classList.add("hidden");
        if (this.resetCount <= 0) {
            this.resetBets(false);
            this.resetCount = Math.floor(Math.random() * 20) + 5;
        }
    }
    resetIndexes() {
        const indexSet: Set<number> = new Set();
        while (indexSet.size < 3) {
            indexSet.add(Math.floor(Math.random() * this.bets.length));
        }
        this.currentIndexes = Array.from(indexSet);
    }
    resetBets(init: boolean) {
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
        if (!init) {
            this.game.sideBetsMenu.activeBetsText.classList.remove("hidden");
            this.game.sideBetsMenu.sideBetsModal.showModal();
        }
    }
    wonSideBet(description: string, payout: number) {
        this.#playWonSideBetSound();
        this.wonSideBetText.textContent = description;
        this.wonSideBetPayout.textContent = `Payout: ${payout.toString(
            10
        )}/1 - Bet amount: $${this.game.sideBetsMenu.sideBetAmount.toString(
            10
        )}`;
        this.game.player.money += payout * this.game.sideBetsMenu.sideBetAmount;
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
    #playWonSideBetSound() {
        if (!this.game.settings.isSoundMuted) {
            this.#wonSideBetSound.currentTime = 0;
            this.#wonSideBetSound.play().catch((err: unknown) => {
                if (err instanceof Error) console.error(err.message);
                this.game.settings.isSoundMuted = true;
                this.game.settings.isSoundMutedBtn.textContent = "Unmute";
                localStorage.setItem("mute-setting", "true");
            });
        }
    }
}
