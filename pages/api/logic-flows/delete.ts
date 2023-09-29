import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "DELETE") {
      throw new Error("Invalid method");
    }

    const body = JSON.parse(req.body);

    if (!body.id) {
      throw new Error("Missing id");
    }

    const deletedFlow = await prisma.logicFlow.delete({
      where: { id: body.id },
    });

    res.status(200).json(deletedFlow);
  } catch (error) {
    res.status(500).json({ message: (error as Error)?.message ?? error });
  }
}
