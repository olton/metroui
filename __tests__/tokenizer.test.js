
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("tokenizer.html tests", () => {
    it("tokenizer.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/tokenizer.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
