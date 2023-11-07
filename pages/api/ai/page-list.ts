import { GPT4_PREVIEW_MODEL, openai } from "@/utils/openai";
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

    const { projectId, accessToken, pageCount, excludedPages } = req.body;
    const project = await prisma.project.findFirstOrThrow({
      where: {
        id: projectId as string,
      },
    });

    const projectResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APPS_BASE_URL}/projects/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const _project = await projectResponse.json();

    const prompt =
      pageCount === "1"
        ? getPagePrompt({
            appDescription: _project.description ?? "",
            appIndustry: _project.industry ?? "",
            entities: JSON.stringify(project.entities ?? []),
            excludedPages: excludedPages,
          })
        : getPagesPrompt({
            appDescription: _project.description ?? "",
            appIndustry: _project.industry ?? "",
            entities: JSON.stringify(project.entities ?? []),
            pageCount: pageCount,
          });

    console.log(prompt);

    const response = await openai.chat.completions.create({
      model: GPT4_PREVIEW_MODEL,
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
    console.log("PAGE LIST", content);

    return res.status(200).json(content);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
