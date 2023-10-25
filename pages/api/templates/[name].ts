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

    const { name } = req.query;
    const tempate = await prisma.template.findFirstOrThrow({
      where: {
        name: name as string,
      },
    });

    return res.status(200).json(tempate);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
