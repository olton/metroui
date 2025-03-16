
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("bottom-sheet.html tests", () => {
    it("bottom-sheet.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/bottom-sheet.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
