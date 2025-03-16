
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("vegas.html tests", () => {
    it("vegas.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/vegas.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
