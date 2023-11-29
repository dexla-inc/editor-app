import { getTemplate } from "@/requests/templates/queries";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "GET") {
      throw new Error("Invalid method");
    }

    const { name } = req.query;

    const includeTiles = false;

    const template = await getTemplate(name as string, includeTiles);

    return res.status(200).json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
