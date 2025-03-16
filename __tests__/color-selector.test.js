
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("color-selector.html tests", () => {
    it("color-selector.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/color-selector.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
