
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("typer.html tests", () => {
    it("typer.html", async () => {
        await B.visit(`${getFileUrl(`./__html__/typer.html`)}`)
        expect(B.error).toBeNull(B.error)
    })
})
