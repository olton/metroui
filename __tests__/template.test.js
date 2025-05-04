
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("template.html tests", () => {
    it("template.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/template.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
