
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("sorter.html tests", () => {
    it("sorter.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/sorter.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
