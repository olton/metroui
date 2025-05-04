
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("html-container.html tests", () => {
    it("html-container.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/html-container.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
