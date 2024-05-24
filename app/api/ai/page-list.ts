import { GPT4_PREVIEW_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { prisma } from "@/utils/prisma";
import { getPagePrompt, getPagesPrompt } from "@/utils/prompts";

export default async function handler(req: Request) {
  try {
    const { body, method } = await req.json();

    if (method !== "POST") {
      throw new Error("Invalid method");
    }

    const { projectId, pageCount, description, industry, excludedPages } = body;
    const project = await prisma.project.findFirstOrThrow({
      where: {
        id: projectId as string,
      },
    });

    const prompt =
      pageCount === "1"
        ? getPagePrompt({
            appDescription: description ?? "",
            appIndustry: industry ?? "",
            entities: JSON.stringify(project.entities ?? []),
            excludedPages: excludedPages,
          })
        : getPagesPrompt({
            appDescription: description ?? "",
            appIndustry: industry ?? "",
            entities: JSON.stringify(project.entities ?? []),
            pageCount: pageCount,
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
    const content = JSON.parse(message.content ?? "[]");

    return Response.json(content.pages, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
