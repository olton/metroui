
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("image-grid.html tests", () => {
    it("image-grid.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/image-grid.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
