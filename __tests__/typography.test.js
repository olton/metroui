
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("typography.html tests", () => {
    it("typography.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/typography.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
