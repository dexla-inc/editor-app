import { useMemo } from "react";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";

export const usePageList = (
  projectId: string,
  valueKey: "id" | "slug" = "id",
) => {
  const { data: pageList, isFetched } = usePageListQuery(projectId, null);

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
