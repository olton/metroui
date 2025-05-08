
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("select-2.html tests", () => {
    it("select-2.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/select-2.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
