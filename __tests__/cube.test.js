
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("cube.html tests", () => {
    it("cube.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/cube.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
