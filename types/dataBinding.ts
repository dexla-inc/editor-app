import { Component } from "@/utils/editor";
import { Endpoint } from "@/requests/datasources/types";

export type BindingType = "Formula" | "JavaScript";
export type BindingTab = "components" | "variables" | "actions" | "others";

export type DataType = "static" | "dynamic" | "boundCode" | "rules";
export type ContextType =
  | "item"
  | "components"
  | "actions"
  | "others"
  | "event"
  | "variables";

export type ConditionProps = {
  rule: string;
  value: {
    static?: any;
    boundCode?: string;
    dataType?: "static" | "boundCode";
  };
  location: string;
  operator: string;
};

export type RuleProps = {
  result: {
    static?: any;
    boundCode?: string;
    dataType?: "static" | "boundCode";
  };
  conditions: ConditionProps[];
};

export type ValueProps = Partial<{
  dataType: DataType;
  static: any;
  dynamic: string;
  boundCode: string;
  rules: RuleProps[];
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
  | "Text"
  | "YesNo"
  | "Boolean"
  | "Array"
  | "Number"
  | "Options"
  | "Select"
  | "Segmented";

export type FieldProps = {
  name: string;
  label: string;
  fieldType: FieldType;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  precision?: number;
  data?: Record<string, any>[];
  defaultValue?: string;
  useTrueOrFalseStrings?: boolean;
  isPageAction?: boolean;
  isTranslatable?: boolean;
  form?: any;
};
