import { Component } from "@/utils/editor";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";
import { FrontEndTypes } from "@/requests/variables/types";

export type BindingType = "Formula" | "JavaScript";
export type BindingTab = "components" | "variables" | "actions" | "others";

export type DataType = "static" | "dynamic" | "boundCode";
export type ContextType =
  | "item"
  | "components"
  | "actions"
  | "others"
  | "event"
  | "variables";

export type ValueProps = Partial<{
  dataType: DataType;
  static: any;
  dynamic: string;
  boundCode: string;
}>;

export type GetValueProps = {
  value?: ValueProps;
  shareableContent?: Record<string, any>;
  staticFallback?: string;
};

export type ComputeValuePropCtx = Record<
  string,
  { actions?: ActionsResponsesType; event?: Event }
>;

export type ComputeValueProps = <T>(
  value: GetValueProps,
  ctx?: ComputeValuePropCtx,
) => T;

export type ActionsResponsesType = Record<
  string,
  {
    success: unknown;
    type: "success" | "error";
    error: unknown;
  }
>;

export type DataProps = {
  component: Component;
  endpoints: Endpoint[] | undefined;
  dataType: DataType;
};

// Data forms
export type FieldType =
  | "password"
  | "email"
  | "tel"
  | "url"
  | "date"
  | "unit"
  | "yesno"
  | "integer"
  | "options"
  | "select"
  | Lowercase<FrontEndTypes>;

export type FieldProps = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  additionalComponent?: JSX.Element;
  decimalPlaces?: number;
  data?: Record<string, any>[];
};
