import { HTML, CSS, cssLoader, info, jsLoader, render } from "@olton/html";

globalThis.HTML = {
    cssLoader,
    jsLoader,
    render,
    ...HTML,
    ...CSS,
    info,
};
