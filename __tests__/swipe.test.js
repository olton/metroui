
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("swipe.html tests", () => {
    it("swipe.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/swipe.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
