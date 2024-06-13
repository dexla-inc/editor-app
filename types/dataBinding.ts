import { Component } from "@/utils/editor";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";

export type BindingType = "Formula" | "JavaScript";
export type BindingTab =
  | "components"
  | "variables"
  | "actions"
  | "auth"
  | "browser";

export type DataType = "static" | "dynamic" | "boundCode" | "rules";
export type ContextType =
  | "item"
  | "auth"
  | "components"
  | "actions"
  | "browser"
  | "event"
  | "variables";

export type RuleProps = {
  result: any;
  conditions: Array<{
    rule: string;
    value: string | string[];
    location: string;
    operator: string;
  }>;
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
