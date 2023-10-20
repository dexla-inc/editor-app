import { IncomingHttpHeaders } from "http";

export const extractHeaders = (
  incomingHttpHeaders: IncomingHttpHeaders,
): Record<string, any> => {
  const headers: Record<string, any> = {};
  for (const [key, value] of Object.entries(incomingHttpHeaders)) {
    if (typeof value === "string") {
      headers[key] = value;
    }
  }
  return headers;
};
