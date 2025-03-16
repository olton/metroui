
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("ripple.html tests", () => {
    it("ripple.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/ripple.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
