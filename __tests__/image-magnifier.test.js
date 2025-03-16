
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("image-magnifier.html tests", () => {
    it("image-magnifier.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/image-magnifier.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
