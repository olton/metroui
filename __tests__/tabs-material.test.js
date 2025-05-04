
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("tabs-material.html tests", () => {
    it("tabs-material.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/tabs-material.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
