export type StreamTypes = "PAGE" | "COMPONENT" | "LAYOUT" | "DESIGN" | "DATA";
type AIRoleTypes = "USER" | "ASSISTANT";

export type ChatHistoryMessage = {
  id: string;
  role: AIRoleTypes;
  content: string;
  created: number;
  requestType: StreamTypes;
};
