export type CustomComponentParams = {
  id: string;
  type: string;
  name: string;
  scopes: string;
  content: string;
  description: string;
};

export type CustomComponentResponse = {
  id: string;
  type: string;
  name: string;
  scope: ComponentScopes;
  content: string;
  description: string;
};

type ComponentScopes = "PROJECT" | "COMPANY" | "GLOBAL";
