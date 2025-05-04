
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("shadow.html tests", () => {
    it("shadow.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/shadow.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
