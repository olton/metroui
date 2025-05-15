
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("sidenav-counter.html tests", () => {
    it("sidenav-counter.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/sidenav-counter.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
