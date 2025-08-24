import { CSS, cssLoader, HTML, info, jsLoader, render } from "@olton/html";

globalThis.HTML = {
    cssLoader,
    jsLoader,
    render,
    ...HTML,
    ...CSS,
    info,
};
