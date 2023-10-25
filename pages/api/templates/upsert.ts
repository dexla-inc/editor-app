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

    const { id, state, name, prompt, type } = req.body;
    const tempate = await prisma.template.upsert({
      where: {
        id,
      },
      update: {
        name,
        state,
        prompt,
        type,
      },
      create: {
        id,
        name,
        state,
        prompt,
        type,
      },
    });

    return res.status(200).json(tempate);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
