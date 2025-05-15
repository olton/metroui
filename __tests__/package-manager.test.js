
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("package-manager.html tests", () => {
    it("package-manager.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/package-manager.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
