import { getPagesPrompt } from "@/utils/prompts";
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

    const { projectId, accessToken } = req.body;
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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: false,
      messages: [
        {
          role: "user",
          content: getPagesPrompt({
            entities: JSON.stringify(project.entities ?? []),
            appDescription: _project.description ?? "",
            appIndustry: _project.industry ?? "",
          }),
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
