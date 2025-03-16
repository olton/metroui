
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("container.html tests", () => {
    it("container.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/container.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
