
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("validator.html tests", () => {
    it("validator.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/validator.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
