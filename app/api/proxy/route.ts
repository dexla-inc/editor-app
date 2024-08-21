import { NextRequest, NextResponse } from "next/server";
import { fromBase64 } from "@/utils/common";

async function handler(req: NextRequest) {
  return handleRequest(req);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};

async function handleRequest(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get("targetUrl");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing targetUrl" }, { status: 400 });
  }

  const validHeaders = [
    "accept",
    "content-type",
    "accept-language",
    "user-agent",
    "authorization",
    "apikey",
  ];

  const decodedUrl = fromBase64(targetUrl as string);

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (validHeaders.includes(key)) {
      headers[key] = value;
    }
  });

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  // Exclude body for GET and DELETE methods
  if (req.method !== "GET" && req.method !== "DELETE" && req.body) {
    fetchOptions.body = JSON.stringify(await req.json());
  }

  try {
    console.log("route.ts-decodedUrl", decodedUrl);
    console.log("route.ts-fetchOptions", fetchOptions);
    const response = await fetch(decodedUrl, fetchOptions);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const error = await response.text();
      console.error("Error fetching data: ", error);
      return NextResponse.json({ error }, { status: response.status });
    }
  } catch (error: any) {
    console.error("Fetch error: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
