import { listTemplates } from "@/requests/templates/queries";
import { listTiles } from "@/requests/tiles/queries";
import { GPT4_PREVIEW_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { prisma } from "@/utils/prisma";
import { getPageGenerationPrompt } from "@/utils/prompts";
import { NextApiRequest, NextApiResponse } from "next";

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
      `${process.env.NEXT_PUBLIC_APPS_BASE_URL}/projects/${projectId}/pages/${pageId}`,
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

    const templates = await listTemplates();

    const templatesData = await templates.results.reduce(
      async (acc, template) => {
        const tiles = await listTiles(template.id as string);

        const prev = await acc;

        return Promise.resolve(`
        ${prev}
        // ${template.name} tiles:
        ${tiles.results.map((tile) => tile.prompt)}
        // ${template.name} type:
        ${template.prompt}
      `);
      },
      "" as any,
    );

    console.log("templatesData", templatesData);

    const prompt = getPageGenerationPrompt({
      entities: JSON.stringify(project?.entities ?? []),
      pageName: page.name ?? "",
      pageDescription: page.description ?? "",
      appDescription: _project?.description ?? "",
      appIndustry: _project?.industry ?? "",
      templateNames: `${templatesData}
  
      type Template = ${templates.results.map((t) => t.name).join(" | ")}
      `,
    });

    console.log("pagePrompt", prompt);

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
    const content = JSON.parse(message.content ?? "{}");
    console.log("PAGE", content);

    return res.status(200).json(content);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
