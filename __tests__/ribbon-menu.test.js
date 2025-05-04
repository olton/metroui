
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("ribbon-menu.html tests", () => {
    it("ribbon-menu.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/ribbon-menu.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
