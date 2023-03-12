import assert from "node:assert";
import test from "node:test";

//import { Card } from "../dist/card.js";

import { Deck } from "../dist/deck.js";

test("Does deck generate 52 cards", () => {
    const testDeck = new Deck();
    testDeck.generateDeck();
    const actualDeckCount = testDeck.cards.length;
    const expectedDeckCount = 52;
    assert.strictEqual(actualDeckCount, expectedDeckCount);
});
