
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("charms.html tests", () => {
    it("charms.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/charms.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
