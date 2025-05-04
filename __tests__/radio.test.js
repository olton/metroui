
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("radio.html tests", () => {
    it("radio.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/radio.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
