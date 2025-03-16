
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("remark.html tests", () => {
    it("remark.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/remark.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
