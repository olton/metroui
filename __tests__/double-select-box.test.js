
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("double-select-box.html tests", () => {
    it("double-select-box.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/double-select-box.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
