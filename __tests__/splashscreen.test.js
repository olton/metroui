
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("splashscreen.html tests", () => {
    it("splashscreen.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/splashscreen.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
