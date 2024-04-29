import { useEditorTreeStore } from "@/stores/editorTree";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";

type UseShareableContentProps = {
  componentId?: string;
  endpoints: PagingResponse<Endpoint>;
};

export const useShareableContent = ({
  componentId,
  endpoints,
}: UseShareableContentProps) => {
  const selectedComponentId = useEditorTreeStore(
    (state) => componentId ?? state.selectedComponentIds?.at(-1),
  );

  const { computeValue } = useDataBinding();

  const [, parentIdsGroup] = selectedComponentId?.split("-related-") ?? [];
  const relatedComponentIds = parentIdsGroup?.split("--") ?? [];

  let shareableContent = {};
  return relatedComponentIds.reduce(
    (acc, groupId) => {
      const [id, index] = groupId.split("__");
      const node = useEditorTreeStore.getState().componentMutableAttrs[id];

      const { dataType = "static" } = node?.props ?? {};

      if (dataType === "dynamic") {
        const parentEndpoint = endpoints?.results?.find(
          (e) => e.id === node?.onLoad?.endpointId,
        );
        const parsedResponse = JSON.parse(
          parentEndpoint?.exampleResponse || "{}",
        );

        acc[groupId] = get(
          parsedResponse,
          `${node?.onLoad?.resultsKey}[0]`,
          parsedResponse,
        );
        shareableContent = cloneDeep(acc[groupId]);
      } else {
        const staticData = computeValue({
          value: node?.onLoad?.data,
          shareableContent: {
            data: shareableContent,
          },
        });
        if (staticData) {
          acc[groupId] = get(staticData, index, staticData);
          shareableContent = cloneDeep(acc[groupId]);
        }
      }

      return acc;
    },
    {} as Record<string, any>,
  );
};
