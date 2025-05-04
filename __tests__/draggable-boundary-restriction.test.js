
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("draggable-boundary-restriction.html tests", () => {
    it("draggable-boundary-restriction.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/draggable-boundary-restriction.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
