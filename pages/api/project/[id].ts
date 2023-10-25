import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

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
    console.log(error);
    return res.status(500).json({ error });
  }
}
