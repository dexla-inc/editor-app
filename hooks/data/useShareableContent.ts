import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import cloneDeep from "lodash.clonedeep";
import { relatedKeys } from "@/utils/data";
import { useMemo } from "react";
import isEmpty from "lodash.isempty";

type UseShareableContentProps = {
  componentId?: string;
};

export const useShareableContent = ({
  componentId,
}: UseShareableContentProps) => {
  const relatedComponentsData = useEditorTreeStore(
    useShallow((state) => {
      const [, parentIdsGroup] =
        (componentId ?? state.selectedComponentIds?.at(-1))?.split(
          "-related-",
        ) || [];
      const relatedComponentIds = parentIdsGroup?.split("--") ?? [];
      return pick(state.relatedComponentsData, relatedComponentIds);
    }),
  );

  const item = useMemo(() => {
    const relatedComponentsDataList = Object.entries(
      relatedComponentsData,
    ).filter(([, value]) => !isEmpty(value));
    const itemData = relatedComponentsDataList?.at(-1);
    const currentIndex = itemData?.[0]?.split("__")?.[1];

    return cloneDeep(relatedComponentsDataList)
      ?.reverse()
      .reduce(
        (acc, [key, value], i) => {
          acc[relatedKeys[i]] = value;
          return acc;
        },
        {
          ...(currentIndex !== undefined && {
            index: currentIndex,
          }),
        } as any,
      );
  }, [relatedComponentsData]);

  return { relatedComponentsData, item };
};
