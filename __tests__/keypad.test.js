
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("keypad.html tests", () => {
    it("keypad.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/keypad.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
