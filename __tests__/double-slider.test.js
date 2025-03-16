
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("double-slider.html tests", () => {
    it("double-slider.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/double-slider.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
