
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("button.html tests", () => {
    it("button.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/button.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
