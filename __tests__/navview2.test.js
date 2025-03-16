
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("navview2.html tests", () => {
    it("navview2.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/navview2.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
