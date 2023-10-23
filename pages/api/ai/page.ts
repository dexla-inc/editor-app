import { getPageGenerationPrompt } from "@/utils/prompts";
import { openai } from "@/utils/openai";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }

    const { projectId, pageId, accessToken } = req.body;
    const project = await prisma.project.findFirstOrThrow({
      where: {
        id: projectId as string,
      },
    });

    const pageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${projectId}/pages/${pageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const page = await pageResponse.json();

    const projectResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const _project = await projectResponse.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are a Page Generator System (PGS). As a PGS you respond with a Page based on a given page name, app description and app industry.`,
        },
        {
          role: "system",
          content: `PGS must respond with a JSON containing the structure of the Page, nothing more. no explanation, no comments, no extra information.`,
        },
        {
          role: "user",
          content: getPageGenerationPrompt({
            entities: JSON.stringify(project?.entities ?? []),
            pageName: page.name ?? "",
            pageDescription: page.description ?? "",
            appDescription: _project?.description ?? "",
            appIndustry: _project?.industry ?? "",
          }),
        },
      ],
    });

    const message = response.choices[0].message;
    const content = JSON.parse(message.content ?? "{}");

    return res.status(200).json(content);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
