
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("app-bar.html tests", () => {
    it("app-bar.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/app-bar.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
