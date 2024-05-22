import { GPT4_PREVIEW_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { prisma } from "@/utils/prisma";
import { getPagePrompt, getPagesPrompt } from "@/utils/prompts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }

    const { projectId, pageCount, description, industry, excludedPages } =
      req.body;
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

    return res.status(200).json(content.pages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
