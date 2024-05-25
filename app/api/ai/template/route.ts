import { listTemplates } from "@/requests/templates/queries-noauth";
import { TemplateDetail } from "@/requests/templates/types";
import { cleanJson, safeJsonParse } from "@/utils/common";
import { GPT4_PREVIEW_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { getTemplatePrompt } from "@/utils/prompts";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    const { appDescription, appIndustry, pageDescription, pageName } = body;

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
    const content = safeJsonParse(cleanedJson ?? "{}");

    return Response.json(content, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
