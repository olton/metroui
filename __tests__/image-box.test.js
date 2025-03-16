
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("image-box.html tests", () => {
    it("image-box.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/image-box.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
