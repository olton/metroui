
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("model.html tests", () => {
    it("model.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/model.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
