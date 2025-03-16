
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("grid.html tests", () => {
    it("grid.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/grid.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
