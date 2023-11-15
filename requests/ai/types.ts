export type AIRequestTypes =
  | "PAGE"
  | "COMPONENT"
  | "LAYOUT"
  | "DESIGN"
  | "DATA"
  | "API"
  | "PAGE_NAMES"
  | "CSS_MODIFIER"
  | "THEME";

export type AIResponseTypes = "JSON" | "TOML" | "QUEUE" | "TEXT";

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
  description: string;
  pageName?: string;
};

export type QueueResponse = {
  message: string;
  callbackUrl: string;
  statusEndpoint: string;
  estimatedTimeOfCompletion: number;
  expectedCallBack: Record<string, string>;
};
