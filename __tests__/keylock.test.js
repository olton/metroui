
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("keylock.html tests", () => {
    it("keylock.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/keylock.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
