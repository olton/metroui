
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("date-picker.html tests", () => {
    it("date-picker.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/date-picker.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
