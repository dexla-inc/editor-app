export type VariableParams = {
  name: string;
  type: FrontEndTypes;
  defaultValue: string;
  value?: string;
  isGlobal: boolean;
  pageId: string;
};

export type FrontEndTypes = "TEXT" | "NUMBER" | "BOOLEAN" | "OBJECT" | "ARRAY";

export const VariableTypes: Record<FrontEndTypes, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  BOOLEAN: "Boolean",
  OBJECT: "Object",
  ARRAY: "Array",
};

export type VariableResponse = VariableParams & {
  id: string;
};
