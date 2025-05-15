
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("gauge.html tests", () => {
    it("gauge.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/gauge.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
