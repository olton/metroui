
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("datetime.html tests", () => {
    it("datetime.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/datetime.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
