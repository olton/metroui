
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("hint.html tests", () => {
    it("hint.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/hint.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
