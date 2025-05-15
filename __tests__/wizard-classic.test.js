
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("wizard-classic.html tests", () => {
    it("wizard-classic.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/wizard-classic.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
