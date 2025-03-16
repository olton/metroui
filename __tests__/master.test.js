
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("master.html tests", () => {
    it("master.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/master.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
