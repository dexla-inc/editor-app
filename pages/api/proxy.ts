import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Construct the URL dynamically based on query params from the client request
  const { targetUrl } = req.query;
  console.log("targetUrl", targetUrl);

  const headers: Record<string, any> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") {
      headers[key] = value;
    }
  }
  delete headers["host"];

  const response = await fetch(targetUrl as string, {
    method: req.method,
    headers,
    body:
      req.method === "POST" || req.method === "PUT"
        ? JSON.stringify(req.body)
        : null,
  });

  if (response.ok) {
    const data = await response.json();
    console.log("data", data);
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "Failed to fetch data from API" });
  }
}
