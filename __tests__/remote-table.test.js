
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("remote-table.html tests", () => {
    it("remote-table.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/remote-table.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
