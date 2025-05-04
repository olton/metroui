
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("color-picker.html tests", () => {
    it("color-picker.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/color-picker.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
