import { decodeSchema, encodeSchema } from "./compression";
import { Component } from "./editor";

export const copyToClipboard = (projectId: string, content: Component) => {
  try {
    const _content = encodeSchema(JSON.stringify({ id: projectId, content }));
    localStorage.setItem("component", _content);
  } catch (error) {
    console.log((error as Error).message);
  }
};

export const pasteFromClipboard = (projectId: string) => {
  try {
    const content = localStorage.getItem("component");
    if (!content) return; // early exit if no content
    const _content = JSON.parse(decodeSchema(content));
    return _content.id !== projectId ? _content.content : null;
  } catch (error) {
    console.log((error as Error).message);
  }
};
