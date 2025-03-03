# TypeScript-Blackjack

## Introduction

Play the game: https://blackjack-browser-game.pages.dev/

A classic BlackJack game made with TypeScript. Playable in the browser on mobile or desktop. Includes several adjustable gameplay and rule settings and an exciting side bet feature. Each hand, the player has the option to bet on a rotating set of side bets for what combination of initial cards will be dealt. For example, there is a 150/1 payout for getting two King of Hearts if that side bet is active.

![Playing cards on a green background resembling a casino table, above a series of red buttons providing gameplay options](/public/blackjack-readme-screenshot.png)

## Settings/Rules

-   BlackJack payout: 2/1
-   Deck number: Adjustable setting between 1-8, default is 4
-   Dealer soft 17: Adjustable setting, dealer stands by default
-   Hitting/doubling down on split aces: Adjustable setting, false by default
-   Hitting/doubling down on split cards besides aces: Allowed
-   Surrender: Late surrender, option can be turned off
-   Insurance: 1/2 of the original bet, option can be turned off
-   Draw speed: Adjustable setting (Relaxed, Normal and Instant)

## Running locally

To run the project locally and make changes, you will need Node.js installed. If you don't already have it, download the LTS version at https://nodejs.org/en

First, run the following command in the terminal to clone the repo:

```
git clone https://github.com/KSmith8888/TypeScript-Blackjack.git
```

(If you don't already have git installed, download it at https://git-scm.com/downloads)

Navigate into the root of the project by running:

```
cd TypeScript-Blackjack
```

Install the project's dependencies with:

```
npm install
```

Run the development server with:

```
npm run dev
```

Finally, navigate to http://localhost:5173/ in your browser to view the project. Changes will be reflected automatically whenever you save.

## Attribution

### Development Dependencies

typescript:  
https://github.com/Microsoft/TypeScript

vite:  
https://github.com/vitejs/vite

eslint and @eslint/js:  
https://github.com/eslint/eslint

typescript-eslint:  
https://github.com/typescript-eslint/typescript-eslint

globals:  
https://github.com/sindresorhus/globals

### Assets

Playing Card Suits by PixLoger licensed under Pixabay content license:  
https://pixabay.com/vectors/playing-cards-cards-suit-spades-2091948/

flipCard by Splashdust (Freesound) under Pixabay content license:  
https://pixabay.com/sound-effects/flipcard-91468/

Card Sounds by henrygillard (Freesound) under Pixabay content license:  
https://pixabay.com/sound-effects/card-sounds-35956/

Riffle Card Shuffle by Kodack (Freesound) under Pixabay content license:  
https://pixabay.com/sound-effects/riffle-card-shuffle-104313/

Arcade UI 6 by floraphonic licensed under Pixabay content license:  
https://pixabay.com/sound-effects/arcade-ui-6-229503/

Arcade UI 16 by floraphonic licensed under Pixabay content license:  
https://pixabay.com/sound-effects/arcade-ui-16-229516/

Arcade UI 4 by floraphonic licensed under Pixabay content license:  
https://pixabay.com/sound-effects/arcade-ui-4-229502/

## License

MIT: https://github.com/KSmith8888/TypeScript-Blackjack/blob/main/LICENSE

Copyright Kevyn Smith 2022-2025
