import { getDataSourceEndpoint } from "@/requests/datasources/queries-noauth";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { performFetch } from "@/utils/actions";
import { NextRequest, NextResponse } from "next/server";
import { Builder } from "xml2js";

type Props = {
  params: {
    id: string;
    endpoint: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { id, endpoint } = params;

  const [endpointResult, deployment] = await Promise.all([
    getDataSourceEndpoint(id, endpoint),
    getDeploymentPage(id, "/"),
  ]);

  const result = performFetch(
    endpointResult.url!,
    endpointResult.methodType,
    endpointResult.headers,
    endpointResult.body,
    endpointResult.mediaType,
  );

  console.log("Endpoint:", result);

  const builder = new Builder({
    xmldec: { version: "1.0", encoding: "UTF-8" },
  });

  const data = {
    root: {
      name: "John",
      age: 26,
      city: "New York",
    },
  };

  const xmlData = builder.buildObject(data);

  return new NextResponse(xmlData, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
