
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("code.html tests", () => {
    it("code.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/code.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
