
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("activity.html tests", () => {
    it("activity.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/activity.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
