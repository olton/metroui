
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("wizard.html tests", () => {
    it("wizard.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/wizard.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
