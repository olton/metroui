
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("eval.html tests", () => {
    it("eval.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/eval.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
