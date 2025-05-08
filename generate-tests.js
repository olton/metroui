import fs from "fs";
import * as path from "path";

const readFiles = (dirname, onFile, onError = () => {}) => {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFile(filename, content);
            });
        });
    });
}

const sourceDir = './__html__/'
const targetDir = './__tests__/'
const test = `
import {beforeAll, afterAll, describe, it, expect, delay, getFileUrl, B} from "@olton/latte";

beforeAll(async () => {
    await B.create()
})

afterAll(async () => {
    await B.bye()
})

describe("$file tests", () => {
    it("$file", async () => {
        await B.visit(\`\$\{getFileUrl(\`./__html__/$file\`\)\}\`)
        expect(B.error).toBeNull(B.error)
    })
})
`

fs.readdir(targetDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join(targetDir, file), (err) => {
            if (err) throw err;
        });
    }
});

readFiles(sourceDir, (filename, content) => {
    const [name, _] = filename.split(".")
    fs.writeFile(`${targetDir}/${name}.test.js`, `${test.replaceAll('$file', filename)}`, function (error) {
        if (error) {
            throw error;
        } else {
            console.log(`File ${filename} created`);
        }
    });
}, (e) => {
    console.log(e)
})

