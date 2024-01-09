import { PagingParams } from "@/requests/types";

export type VariableParams = {
  name: string;
  type: FrontEndTypes;
  defaultValue: string | null;
};

export type FrontEndTypes = "TEXT" | "NUMBER" | "BOOLEAN" | "OBJECT" | "ARRAY";

export const VariableTypes: Record<FrontEndTypes, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  BOOLEAN: "Boolean",
  OBJECT: "Object",
  ARRAY: "Array",
};

export const VariableTypesOptions = Object.keys(VariableTypes).map((key) => ({
  label: VariableTypes[key as FrontEndTypes],
  value: key,
}));

export type VariableResponse = VariableParams & {
  id: string;
};

export type VariablePagingParams = PagingParams & {
  pageId?: string;
  isGlobal?: boolean;
};
