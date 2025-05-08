
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("context-menu.html tests", () => {
    it("context-menu.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/context-menu.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
