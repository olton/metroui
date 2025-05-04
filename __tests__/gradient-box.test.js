
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("gradient-box.html tests", () => {
    it("gradient-box.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/gradient-box.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
