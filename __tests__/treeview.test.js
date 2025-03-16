
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("treeview.html tests", () => {
    it("treeview.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/treeview.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
