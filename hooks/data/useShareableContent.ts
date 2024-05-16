import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import { useDataTransformers } from "@/hooks/data/useDataTransformers";

type UseShareableContentProps = {
  componentId?: string;
};

export const useShareableContent = ({
  componentId,
}: UseShareableContentProps) => {
  const { itemTransformer } = useDataTransformers();

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

  const item = itemTransformer(relatedComponentsData);

  return { relatedComponentsData, item };
};
