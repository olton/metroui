
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("gradients.html tests", () => {
    it("gradients.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/gradients.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
