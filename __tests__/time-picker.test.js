
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("time-picker.html tests", () => {
    it("time-picker.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/time-picker.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
