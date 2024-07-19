import crawl from "tree-crawl";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { decodeSchema } from "@/utils/compression";
import { safeJsonParse } from "@/utils/common";
import { headers } from "next/headers";

function containsVariableId(obj: any, variableId: string): boolean {
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (
        typeof obj[key] === "object" &&
        containsVariableId(obj[key], variableId)
      ) {
        return true;
      }
      if (typeof obj[key] === "string" && obj[key].includes(variableId)) {
        return true;
      }
    }
  }
  return false;
}

export async function GET(req: Request, context: { params: Params }) {
  try {
    const headersList = headers();
    const accessToken = headersList.get("Authorization");
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");
    const variableId = searchParams.get("variableId");

    const { id: projectId } = context.params;

    const pageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${projectId}/pages/state`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken as string,
        },
      },
    );

    const components: any[] = [];
    const { results: pages } = await pageResponse.json();
    console.log("===>", pages);
    (pages ?? []).forEach((page: any) => {
      const pageState = safeJsonParse(decodeSchema(page.state));
      if (page.id === pageId) {
        crawl(
          pageState.root,
          (node, context) => {
            const matchingActions = (node.actions ?? [])
              ?.filter((action: any) =>
                containsVariableId(action.action, variableId!),
              )
              .map((action: any) => ({
                trigger: action.trigger,
                actionEvent: action.action.name,
              }));

            const onLoadKeys = Object.keys(node.onLoad ?? {}).filter((key) =>
              containsVariableId(node.onLoad[key], variableId!),
            );

            if (matchingActions.length > 0) {
              components.push({
                componentId: node.id,
                actions: matchingActions,
                onLoad: onLoadKeys,
              });
            }
          },
          {
            getChildren: (node) => node.children || [],
          },
        );
      }
    });

    return Response.json(
      {
        components,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
