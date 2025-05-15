
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("accordion.html tests", () => {
    it("accordion.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/accordion.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
