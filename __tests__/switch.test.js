
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("switch.html tests", () => {
    it("switch.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/switch.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
