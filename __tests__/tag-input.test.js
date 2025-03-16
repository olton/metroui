
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("tag-input.html tests", () => {
    it("tag-input.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/tag-input.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
