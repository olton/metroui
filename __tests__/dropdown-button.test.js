
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("dropdown-button.html tests", () => {
    it("dropdown-button.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/dropdown-button.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
