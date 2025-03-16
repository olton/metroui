
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("material-input.html tests", () => {
    it("material-input.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/material-input.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
