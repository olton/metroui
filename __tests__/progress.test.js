
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("progress.html tests", () => {
    it("progress.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/progress.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
