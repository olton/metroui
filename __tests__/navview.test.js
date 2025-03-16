
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("navview.html tests", () => {
    it("navview.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/navview.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
