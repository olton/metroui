
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("colors.html tests", () => {
    it("colors.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/colors.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
