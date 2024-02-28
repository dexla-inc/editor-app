import { PagingParams } from "@/requests/types";

export type VariableResponse = {
  id: string;
  name: string;
  type: FrontEndTypes;
  defaultValue?: any | null;
  isGlobal: boolean;
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

export type VariablePagingParams = PagingParams & {};
