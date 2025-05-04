
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("table.html tests", () => {
    it("table.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/table.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
