
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("tile.html tests", () => {
    it("tile.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/tile.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
