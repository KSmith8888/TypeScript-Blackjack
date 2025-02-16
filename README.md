# TypeScript-Blackjack

A classic BlackJack game, playable in the browser. The player and dealer receive cards that have been randomly selected from a generated deck and whoever gets closest to twenty-one without going over wins. Current scores and total money remaining each hand are displayed on the board. On subsequent hands, the all time high score is shown, which is stored in localStorage.

Play the game at https://ksmith8888.github.io/TypeScript-Blackjack/

![Playing cards on a green background resembling a casino table, above a series of red buttons providing gameplay options](/public/blackjack-screenshot-desktop.png)

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

## License

MIT: https://github.com/KSmith8888/TypeScript-Blackjack/blob/main/LICENSE
