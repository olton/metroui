
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("action-button.html tests", () => {
    it("action-button.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/action-button.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
