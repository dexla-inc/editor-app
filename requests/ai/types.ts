export type AIRequestTypes =
  | "PAGE"
  | "COMPONENT"
  | "LAYOUT"
  | "DESIGN"
  | "DATA"
  | "API";
type AIRoleTypes = "USER" | "ASSISTANT";

export type ChatHistoryMessage = {
  id: string;
  role: AIRoleTypes;
  content: string;
  created: number;
  requestType: AIRequestTypes;
};

export type EventSourceParams = {
  type: AIRequestTypes;
  pageName?: string;
  description?: string;
};
