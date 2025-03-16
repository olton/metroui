
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("input-mask.html tests", () => {
    it("input-mask.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/input-mask.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
