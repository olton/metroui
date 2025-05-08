
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("table2.html tests", () => {
    it("table2.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/table2.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
