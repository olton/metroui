
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("tpl.html tests", () => {
    it("tpl.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/tpl.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
