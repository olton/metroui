
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("directive2.html tests", () => {
    it("directive2.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/directive2.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
