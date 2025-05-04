
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("counter.html tests", () => {
    it("counter.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/counter.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
