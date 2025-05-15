
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("select-{source}.html tests", () => {
    it("select-{source}.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/select-{source}.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
