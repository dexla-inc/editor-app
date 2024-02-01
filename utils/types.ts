export type BindingType = "Formula" | "JavaScript";
export type BindingTab =
  | "components"
  | "variables"
  | "actions"
  | "auth"
  | "browser";

export type ValueProps = {
  dataType?: "static" | "dynamic" | "boundCode";
  static: string;
  dynamic: string;
  boundCode: string;
};
