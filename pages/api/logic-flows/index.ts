import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "GET") {
      throw new Error("Invalid method");
    }

    const projectId = req.query.projectId as string;
    const pageId = req.query.pageId as string;

    if (!projectId) {
      throw new Error("Missing project id");
    }

    if (!pageId) {
      throw new Error("Missing page id");
    }

    const flows = await prisma.logicFlow.findMany({
      where: {
        OR: [
          {
            projectId,
            pageId,
          },
          { isGlobal: true },
        ],
      },
    });
    res.status(200).json(flows);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: (error as Error)?.message ?? error });
  }
}
