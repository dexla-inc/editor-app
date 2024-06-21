import { getDataSourceEndpoint } from "@/requests/datasources/queries-noauth";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { toQueryString } from "@/types/dashboardTypes";
import { performFetch } from "@/utils/actionsApi";
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
    getDataSourceEndpoint(id, endpoint, "no-cache"),
    getDeploymentPage(id, "/", "no-cache"),
  ]);

  const rssFeeds = deployment?.project?.apps?.filter(
    (f) => f.type === "rss_feed",
  );
  if (!rssFeeds) {
    return new NextResponse("Project does not have any rss_feed apps", {
      status: 404,
    });
  }

  const rssFeed = rssFeeds.find((f) => f.configuration.endpointId === endpoint);

  if (!rssFeed) {
    return new NextResponse(
      "Project does not have rss_feed app for this endpoint",
      {
        status: 404,
      },
    );
  }

  const queryString = toQueryString(rssFeed.configuration.binds.parameter);

  const result = await performFetch(
    endpointResult.url + `${queryString}`,
    endpointResult.methodType,
    rssFeed.configuration.binds.header,
    undefined,
    endpointResult.mediaType,
  );

  const builder = new Builder({
    xmldec: { version: "1.0", encoding: "UTF-8" },
    attrkey: "$",
  });

  const xmlData = builder.buildObject(result);

  return new NextResponse(xmlData, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
