
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("treeview2.html tests", () => {
    it("treeview2.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/treeview2.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
