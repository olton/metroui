
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("cards.html tests", () => {
    it("cards.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/cards.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
