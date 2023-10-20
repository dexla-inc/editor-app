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

    const { pageId } = req.body;
    // TODO: Integrate with C# backend
    /*  const page = await prisma.page.findFirstOrThrow({
      where: {
        id: pageId as string,
      },
      include: {
        project: true,
      },
    });

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
            entities: JSON.stringify(page.project?.entities ?? []),
            pageName: page.name ?? "",
            pageDescription: page.description ?? "",
            appDescription: page.project?.description ?? "",
            appIndustry: page.project?.industry ?? "",
          }),
        },
      ],
    });

    const message = response.choices[0].message;

    const updatedPage = await prisma.page.update({
      where: {
        id: pageId as string,
      },
      data: {
        state: message.content,
      },
    }); */

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
