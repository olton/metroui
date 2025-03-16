
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("splitter.html tests", () => {
    it("splitter.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/splitter.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
