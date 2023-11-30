import { decodeSchema, encodeSchema } from "./compression";
import { Component } from "./editor";

export const copyToClipboard = async (
  projectId: string,
  content: Component,
) => {
  try {
    const _content = encodeSchema(JSON.stringify({ id: projectId, content }));
    if (!navigator.clipboard) return; // early exit if clipboard is not supported
    await navigator.clipboard.writeText(_content);
  } catch (error) {
    console.log(error);
  }
};

export const pasteFromClipboard = async (projectId: string) => {
  try {
    if (!navigator.clipboard) return; // early exit if clipboard is not supported
    const content = await navigator.clipboard.readText();
    const _content = JSON.parse(decodeSchema(content));
    return _content.id !== projectId ? _content.content : null;
  } catch (error) {
    console.log(error);
  }
};
