
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("dialog.html tests", () => {
    it("dialog.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/dialog.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
