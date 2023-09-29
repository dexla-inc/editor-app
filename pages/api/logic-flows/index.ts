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

    const projectId = req.query.projectId;

    if (!projectId) {
      throw new Error("Missing project id");
    }

    const flows = await prisma.logicFlow.findMany({
      where: { projectId: projectId as string },
    });
    res.status(200).json(flows);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: (error as Error)?.message ?? error });
  }
}
