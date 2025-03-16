
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("lightbox.html tests", () => {
    it("lightbox.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/lightbox.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
