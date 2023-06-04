import lz from "lzutf8";

export const encodeSchema = (schema: string) =>
  lz.encodeBase64(lz.compress(schema));

export const decodeSchema = (schema: string) =>
  lz.decompress(lz.decodeBase64(schema)) as string;
