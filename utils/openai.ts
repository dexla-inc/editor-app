import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const GPT4_MODEL = "gpt-4";
export const GPT4_PREVIEW_MODEL = "gpt-4-1106-preview";
export const GPT35_TURBO_MODEL = "gpt-3.5-turbo-1106";
