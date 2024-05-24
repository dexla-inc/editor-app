import { fromBase64 } from "@/utils/common";

async function handler(req: Request) {
  const { body, query, method, headers: reqHeaders } = await req.json();
  // Construct the URL dynamically based on query params from the client request
  const { targetUrl } = query;

  if (!targetUrl) {
    return Response.json({ error: "Missing targetUrl" }, { status: 400 });
  }

  const validHeaders = [
    "accept",
    "content-type",
    "accept-language",
    "user-agent",
    "authorization",
  ];

  const decodedUrl = fromBase64(targetUrl as string);

  const headers: Record<string, string> = {};
  Object.entries(reqHeaders).forEach(([key, value]) => {
    if (validHeaders.includes(key) && typeof value === "string") {
      headers[key] = value;
    }
  });

  const fetchOptions: RequestInit = {
    method: method,
    headers,
  };

  // Exclude body for GET and DELETE methods
  if (method !== "GET" && method !== "DELETE" && body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(decodedUrl as string, fetchOptions);

    if (response.ok) {
      const data = await response.json();
      return Response.json(data, { status: 200 });
    } else {
      const error = await response.text();
      console.error("Error fetching data: ", error);
      return Response.json({ error }, { status: response.status });
    }
  } catch (error: any) {
    console.error("Fetch error: ", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
