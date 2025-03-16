
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("load-metro.html tests", () => {
    it("load-metro.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/load-metro.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
