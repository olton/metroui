
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("shortcuts.html tests", () => {
    it("shortcuts.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/shortcuts.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
