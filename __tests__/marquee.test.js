
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("marquee.html tests", () => {
    it("marquee.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/marquee.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
