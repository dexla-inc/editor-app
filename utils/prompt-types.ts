import { AIResponseTypes } from "@/requests/ai/types";
import { MantineThemeExtended } from "@/stores/editor";

export type PromptParams = {
  pageName?: string;
  pageDescription?: string;
  appDescription?: string;
  appIndustry?: string;
  entities?: string;
  templates?: string;
  description?: string;
  pageCount?: string;
  excludedPages?: string;
  responseType?: AIResponseTypes;
  theme?: MantineThemeExtended;
};
