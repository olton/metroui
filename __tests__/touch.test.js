
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("touch.html tests", () => {
    it("touch.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/touch.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
