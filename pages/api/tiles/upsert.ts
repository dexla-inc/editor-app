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

    const { tiles } = req.body;
    await Promise.all(
      tiles.map(async (tile: any) => {
        return await prisma.tile.upsert({
          where: {
            id: tile.id,
          },
          update: {
            ...tile,
          },
          create: {
            ...tile,
          },
        });
      }),
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
