
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("image-placeholder.html tests", () => {
    it("image-placeholder.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/image-placeholder.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
