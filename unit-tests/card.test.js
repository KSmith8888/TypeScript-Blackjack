import assert from "node:assert";
import test from "node:test";

import { Card } from "../dist/card.js";

test("card properties", async (t) => {
    const testCard = new Card("spade", 10);
    const actualSuitType = typeof testCard.suit;
    const expectedSuitType = "string";
    await t.test("suit", () => {
        assert.strictEqual(
            actualSuitType,
            expectedSuitType,
            "The suit was not the correct type"
        );
    });
    const actualValueType = typeof testCard.rank;
    const expectedValueType = "number";
    await t.test("value", () => {
        assert.strictEqual(
            actualValueType,
            expectedValueType,
            "The rank was not the correct type"
        );
    });
});
