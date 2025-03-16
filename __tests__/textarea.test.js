
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("textarea.html tests", () => {
    it("textarea.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/textarea.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
