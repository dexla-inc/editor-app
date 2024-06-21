import { useSearchParams } from "next/navigation";
import { ValueProps } from "@/types/dataBinding";
import isEqual from "lodash.isequal";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { useMemo } from "react";

export const useQueryParamsMatch = (
  queryStrings?: Array<{ key: string; value: ValueProps }>,
) => {
  const queryParams = useSearchParams();

  const urlSearchParams = useMemo(
    () =>
      queryParams &&
      Array.from(queryParams.entries()).map(([key, value]) => ({
        key,
        value,
      })),
    [queryParams],
  );

  const computedQueryStrings = useComputeValue({ onLoad: queryStrings });
  if (!queryStrings) {
    return true;
  }

  return isEqual(urlSearchParams, computedQueryStrings);
};
