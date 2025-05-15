
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("analog-clock.html tests", () => {
    it("analog-clock.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/analog-clock.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
