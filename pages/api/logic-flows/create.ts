import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const body = req.body;
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    if (!body.projectId) {
      throw new Error("Missing required projectId param");
    }

    if (!body.name) {
      throw new Error("Missing required name params");
    }

    const data = body.data as string;

    const logicFlow = await prisma.logicFlow.create({
      data: {
        data,
        name: body.name,
        projectId: body.projectId,
        pageId: body.pageId,
        isGlobal: body.isGlobal ?? false,
      },
    });

    res.status(200).json(logicFlow);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: (error as Error)?.message ?? error });
  }
}
