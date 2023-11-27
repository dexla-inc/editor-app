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

    const { companyId, name } = req.query;

    const template = await getTemplate(companyId as string, name as string);

    return res.status(200).json(template);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
