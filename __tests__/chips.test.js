
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("chips.html tests", () => {
    it("chips.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/chips.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
