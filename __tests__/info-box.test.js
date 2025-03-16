
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("info-box.html tests", () => {
    it("info-box.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/info-box.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
