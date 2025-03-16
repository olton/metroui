
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("scrollbar.html tests", () => {
    it("scrollbar.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/scrollbar.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
