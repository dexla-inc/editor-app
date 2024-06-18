import { getDataSourceEndpoint } from "@/requests/datasources/queries-noauth";
import { performFetch } from "@/utils/actions";
import { NextRequest, NextResponse } from "next/server";
import { Builder } from "xml2js";

type Props = {
  params: {
    endpoint: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const endpointId = params.endpoint;

  const endpoint = await getDataSourceEndpoint("empty", endpointId);

  const result = performFetch(
    endpoint.url!,
    endpoint.methodType,
    endpoint.headers,
    endpoint.body,
    endpoint.mediaType,
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
