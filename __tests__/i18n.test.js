
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("i18n.html tests", () => {
    it("i18n.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/i18n.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
