
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("file.html tests", () => {
    it("file.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/file.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
