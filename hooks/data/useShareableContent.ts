import { useEditorTreeStore } from "@/stores/editorTree";
import { useDataTransformers } from "@/hooks/data/useDataTransformers";
import get from "lodash.get";
import { cloneObject } from "@/utils/common";

type UseShareableContentProps = {
  componentId?: string;
  computeValue: any;
};

export const useShareableContent = ({
  componentId,
  computeValue,
}: UseShareableContentProps) => {
  const { itemTransformer } = useDataTransformers();

  const selectedComponentId =
    componentId ?? useEditorTreeStore.getState().selectedComponentIds?.at(-1);

  const [, parentIdsGroup] = selectedComponentId?.split("-related-") ?? [];
  const relatedComponentIds = parentIdsGroup?.split("--") ?? [];

  let shareableContent = {};
  const relatedComponentsData = relatedComponentIds.reduce(
    (acc, groupId) => {
      const [id, index] = groupId.split("__");
      const node = useEditorTreeStore.getState().componentMutableAttrs[id];

      const { dataType = "static" } = node?.props ?? {};

      if (dataType === "dynamic") {
        const parentData =
          useEditorTreeStore.getState().relatedComponentsData[id];

        acc[groupId] = get(
          parentData,
          `${node?.onLoad?.resultsKey}[${index}]`,
          parentData,
        );
        shareableContent = cloneObject(acc[groupId]);
      } else {
        const staticData = computeValue({
          value: node?.onLoad?.data,
          shareableContent: {
            data: shareableContent,
          },
        });
        if (staticData) {
          acc[groupId] = get(staticData, index, staticData);
          shareableContent = cloneObject(acc[groupId]);
        }
      }

      return acc;
    },
    {} as Record<string, any>,
  );

  const item = itemTransformer(relatedComponentsData);

  return { relatedComponentsData, item };
};
