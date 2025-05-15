
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("t-menu.html tests", () => {
    it("t-menu.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/t-menu.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
