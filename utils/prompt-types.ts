import { AIResponseTypes } from "@/requests/ai/types";
import { TemplateDetail } from "@/requests/templates/types";
import { MantineThemeExtended } from "@/stores/editor";

export type PromptParams = {
  pageName?: string;
  pageDescription?: string;
  appDescription?: string;
  appIndustry?: string;
  entities?: string;
  templateNames?: string;
  description?: string;
  pageCount?: string;
  excludedPages?: string;
  responseType?: AIResponseTypes;
  theme?: MantineThemeExtended;
  templates?: TemplateDetail[];
};
