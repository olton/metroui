
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("color-palette.html tests", () => {
    it("color-palette.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/color-palette.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
