
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("material-tabs.html tests", () => {
    it("material-tabs.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/material-tabs.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
