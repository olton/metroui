
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("adblock.html tests", () => {
    it("adblock.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/adblock.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
