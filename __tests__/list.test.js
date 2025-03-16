
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("list.html tests", () => {
    it("list.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/list.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
