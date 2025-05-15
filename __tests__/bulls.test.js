
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("bulls.html tests", () => {
    it("bulls.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/bulls.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
