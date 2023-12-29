import { listTemplates } from "@/requests/templates/queries-noauth";
import { TemplateDetail } from "@/requests/templates/types";
import { cleanJson } from "@/utils/common";
import { GPT4_PREVIEW_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { getTemplatePrompt } from "@/utils/prompts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }

    const { appDescription, appIndustry, pageDescription, pageName } = req.body;

    const templates = await listTemplates();

    const prompt = getTemplatePrompt({
      pageName: pageName,
      pageDescription: pageDescription ?? "",
      appDescription: appDescription ?? "",
      appIndustry: appIndustry ?? "",
      templates: templates.results.map((template: TemplateDetail) => ({
        name: template.name,
        type: template.type,
        ...(template.tags &&
          template.tags.length > 0 && { tags: template.tags }),
      })),
    });

    console.log("templatePrompt", prompt);

    const response = await openai.chat.completions.create({
      model: GPT4_PREVIEW_MODEL,
      response_format: {
        type: "json_object",
      },
      stream: false,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const message = response.choices[0].message;
    const cleanedJson = cleanJson(message.content);
    const content = JSON.parse(cleanedJson ?? "{}");
    console.log("TEMPLATE", content);

    return res.status(200).json(content);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
