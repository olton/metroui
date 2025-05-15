
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("animate-border.html tests", () => {
    it("animate-border.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/animate-border.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
