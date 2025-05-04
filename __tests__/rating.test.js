
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("rating.html tests", () => {
    it("rating.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/rating.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
