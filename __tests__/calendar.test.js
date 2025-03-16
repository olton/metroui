
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("calendar.html tests", () => {
    it("calendar.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/calendar.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
