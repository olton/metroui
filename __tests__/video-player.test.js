
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("video-player.html tests", () => {
    it("video-player.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/video-player.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
