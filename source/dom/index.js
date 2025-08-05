import { $ as Dom } from "@olton/dom";

globalThis.Dom = Dom;

if (typeof $ === "undefined") {
    globalThis.$ = Dom;
}
