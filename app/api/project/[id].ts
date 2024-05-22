import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "GET") {
      throw new Error("Invalid method");
    }

    const { id } = req.query;
    const project = await prisma.project.findFirstOrThrow({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
