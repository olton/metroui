
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("table-static.html tests", () => {
    it("table-static.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/table-static.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
