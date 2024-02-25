export type BindingType = "Formula" | "JavaScript";
export type BindingTab =
  | "components"
  | "variables"
  | "actions"
  | "auth"
  | "browser";

export type ValueProps = Partial<{
  dataType: "static" | "dynamic" | "boundCode";
  static: any;
  dynamic: string;
  boundCode: string;
}>;
