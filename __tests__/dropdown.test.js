
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("dropdown.html tests", () => {
    it("dropdown.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/dropdown.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
