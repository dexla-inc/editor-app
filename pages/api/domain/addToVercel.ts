import { addDomainToVercel } from "@/utils/domains";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const domain = req.body.domain as string;

    const response = await addDomainToVercel(domain);
    const json = await response.json();

    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error });
  }
}
