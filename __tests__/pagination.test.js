
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("pagination.html tests", () => {
    it("pagination.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/pagination.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
