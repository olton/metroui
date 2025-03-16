
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("calendar-picker.html tests", () => {
    it("calendar-picker.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/calendar-picker.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
