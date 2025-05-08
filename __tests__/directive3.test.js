
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("directive3.html tests", () => {
    it("directive3.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/directive3.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
