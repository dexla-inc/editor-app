import type { NextApiRequest, NextApiResponse } from "next";
import { listVariables } from "@/requests/variables/queries-noauth";
import { useVariableStore } from "@/stores/variables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Construct the URL dynamically based on query params from the client request
  const { projectId } = req.query;

  // const headers: Record<string, any> = {};
  // for (const [key, value] of Object.entries(req.headers)) {
  //   if (typeof value === "string") {
  //     headers[key] = value;
  //   }
  // }
  // delete headers["host"];

  // const response = await listVariables(projectId as string);

  // const response = await fetch(targetUrl as string, {
  //   method: req.method,
  //   headers,
  //   body:
  //     req.method === "POST" || req.method === "PUT"
  //       ? JSON.stringify(req.body)
  //       : null,
  // });
  // useVariableStore.getState().initializeVariableList(response?.results);

  // if (response.ok) {
  //   const data = await response.json();
  res.status(200).json("done");
  // } else {
  //   res.status(400).json({ error: "Failed to fetch data from API" });
  // }
}
