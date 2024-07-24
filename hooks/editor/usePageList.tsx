import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useMemo } from "react";
import { useEditorParams } from "./useEditorParams";

export const usePageList = (
  projectId?: string,
  valueKey: "id" | "slug" = "id",
) => {
  const { id } = useEditorParams();
  const { data: pageList, isFetched } = usePageListQuery(projectId || id, null);

  const pages = useMemo(
    () =>
      isFetched && pageList
        ? pageList.results.map((page) => ({
            label: page.title,
            value: page?.[valueKey],
          }))
        : [],
    [isFetched, pageList, valueKey],
  );

  return pages;
};
