
import {beforeAll, afterAll, describe, it, expect, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create({
        coverage: {
            filter: ["lib/metro.js"]
        }
    })
})

afterAll(async () => {
    await B.bye()
})

describe("accordion.html tests", () => {
    it("accordion.html", async () => {
        debugger
        await B.visit(`${getFileUrl(`./__html__/accordion.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
