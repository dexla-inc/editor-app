import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Construct the URL dynamically based on query params from the client request
  const { targetUrl } = req.query;

  const validHeaders = [
    "accept",
    "content-type",
    "accept-language",
    "user-agent",
    "authorization",
  ];

  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (validHeaders.includes(key) && typeof value === "string") {
      headers[key] = value;
    }
  });

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  // Exclude body for GET and DELETE methods
  if (req.method !== "GET" && req.method !== "DELETE" && req.body) {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl as string, fetchOptions);

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const error = await response.text();
      console.error("Error fetching data: ", error);
      res.status(response.status).json({ error });
    }
  } catch (error: any) {
    console.error("Fetch error: ", error.message);
    res.status(500).json({ error: error.message });
  }
}
