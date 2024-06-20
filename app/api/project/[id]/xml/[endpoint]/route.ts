import { getDataSourceEndpoint } from "@/requests/datasources/queries-noauth";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { getUrl, performFetch } from "@/utils/actionsApi";
import { removeEmpty } from "@/utils/common";
import { NextRequest, NextResponse } from "next/server";
import { Builder } from "xml2js";

type Props = {
  params: {
    id: string;
    endpoint: string;
  };
};

const anonServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYm5paGhlbm9odHlydXpyZmhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODM1OTUyMywiZXhwIjoyMDMzOTM1NTIzfQ._vVbxLM8TpiKVCYFNJk7Jb5PxEZoTcAQhnLJakPXVQc";

function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_]/g, "_");
}

export async function GET(
  req: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { id, endpoint } = params;

  const [endpointResult, deployment] = await Promise.all([
    getDataSourceEndpoint(id, endpoint),
    getDeploymentPage(id, "/"),
  ]);

  const result = await performFetch(
    endpointResult.url! + "?limit=1",
    endpointResult.methodType,
    {
      ...endpointResult.headers,
      Authorization: "Bearer " + anonServiceKey,
      apikey: anonServiceKey,
    },
    endpointResult.body,
    endpointResult.mediaType,
  );

  console.log("result:", result);

  const builder = new Builder({
    xmldec: { version: "1.0", encoding: "UTF-8" },
  });

  const sanitizedResult = result.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [sanitizeKey(key), value]),
    ),
  );

  const data = {
    root: {
      property: sanitizedResult,
    },
  };

  console.log("data:", data);

  const xmlData = builder.buildObject(data);

  return new NextResponse(xmlData, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
