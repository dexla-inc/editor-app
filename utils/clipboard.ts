import { decodeSchema, encodeSchema } from "./compression";
import { Component } from "./editor";

export const copyToClipboard = (content: Component) => {
  try {
    const _content = encodeSchema(JSON.stringify(content));
    localStorage.setItem("component", _content);
  } catch (error) {
    console.log((error as Error).message);
  }
};

export const pasteFromClipboard = () => {
  try {
    const content = localStorage.getItem("component");
    if (!content) return; // early exit if no content
    const _content = JSON.parse(decodeSchema(content));
    return _content;
  } catch (error) {
    console.log((error as Error).message);
  }
};
