
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("push-button.html tests", () => {
    it("push-button.html", async () => {
        await B.visit(`${getFileUrl(`./examples/push-button.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
