
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("input.html tests", () => {
    it("input.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/input.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
