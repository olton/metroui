
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("audio-player.html tests", () => {
    it("audio-player.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/audio-player.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
