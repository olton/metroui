import {
    addCssRule,
    addStyle,
    clearViewStorageHolder,
    createStyleElement,
    createStyleSheet,
    cssLoader,
    HTML,
    info,
    jsLoader,
    render,
    viewLoader,
} from "@olton/html";

globalThis.HTML = {
    addStyle,
    addCssRule,
    cssLoader,
    jsLoader,
    viewLoader,
    clearViewStorageHolder,
    createStyleElement,
    createStyleSheet,
    render,
    ...HTML,
    info,
};
