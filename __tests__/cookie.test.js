
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("cookie.html tests", () => {
    it("cookie.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/cookie.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
