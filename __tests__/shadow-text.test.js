
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("shadow-text.html tests", () => {
    it("shadow-text.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/shadow-text.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
