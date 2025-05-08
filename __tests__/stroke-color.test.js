
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("stroke-color.html tests", () => {
    it("stroke-color.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/stroke-color.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
