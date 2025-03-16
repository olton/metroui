
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("v-menu.html tests", () => {
    it("v-menu.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/v-menu.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
