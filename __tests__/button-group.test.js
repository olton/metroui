
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("button-group.html tests", () => {
    it("button-group.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/button-group.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
