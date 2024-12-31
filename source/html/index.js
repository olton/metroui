/** @format */

import {
  addCssRule,
  addStyle,
  clearViewStorageHolder,
  createStyleElement,
  createStyleSheet,
  cssLoader,
  htmljs,
  jsLoader,
  render,
  viewLoader,
} from "@olton/html";

globalThis.Html = {
  addStyle,
  addCssRule,
  cssLoader,
  jsLoader,
  viewLoader,
  clearViewStorageHolder,
  createStyleElement,
  createStyleSheet,
  render,
  ...htmljs,
};
