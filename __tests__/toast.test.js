
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("toast.html tests", () => {
    it("toast.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/toast.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
