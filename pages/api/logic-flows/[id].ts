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

    const flow = await prisma.logicFlow.findFirstOrThrow({
      where: {
        id: req.query.id as string,
      },
    });

    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ message: (error as Error)?.message ?? error });
  }
}
