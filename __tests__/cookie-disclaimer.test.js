
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("cookie-disclaimer.html tests", () => {
    it("cookie-disclaimer.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/cookie-disclaimer.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
