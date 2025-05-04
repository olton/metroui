
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("calendar-wide.html tests", () => {
    it("calendar-wide.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/calendar-wide.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
