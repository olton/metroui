
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("carousel.html tests", () => {
    it("carousel.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/carousel.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
