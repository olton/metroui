
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("sidenav.html tests", () => {
    it("sidenav.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/sidenav.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
