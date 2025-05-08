
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("hover-box.html tests", () => {
    it("hover-box.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/hover-box.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
