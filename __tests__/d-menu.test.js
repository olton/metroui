
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("d-menu.html tests", () => {
    it("d-menu.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/d-menu.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
