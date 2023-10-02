import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "PATCH") {
      throw new Error("Invalid method");
    }

    const body = req.body;

    if (!body.id) {
      throw new Error("Missing id");
    }

    const { id, ...rest } = body;
    const updatedFlow = await prisma.logicFlow.update({
      where: {
        id: id as string,
      },
      data: rest,
    });

    res.status(200).json(updatedFlow);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: (error as Error)?.message ?? error });
  }
}
