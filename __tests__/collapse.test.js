
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("collapse.html tests", () => {
    it("collapse.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/collapse.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
