
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("donut.html tests", () => {
    it("donut.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/donut.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
