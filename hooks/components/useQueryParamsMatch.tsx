import { useRouter } from "next/router";
import { ValueProps } from "@/types/dataBinding";
import isEqual from "lodash.isequal";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useComputeValue } from "../data/useComputeValue";

export const useQueryParamsMatch = (
  queryStrings?: Array<{ key: string; value: ValueProps }>,
) => {
  const router = useRouter();

  const initialQueryStrings =
    queryStrings?.reduce(
      (acc, next) => {
        acc[next.key] = next.value;
        return acc;
      },
      {} as Record<string, ValueProps>,
    ) || {};

  const computedQueryStrings = useComputeValue({ onLoad: initialQueryStrings });

  if (!queryStrings) {
    return true;
  }

  const pageQueryStrings = omit(router.query, ["id", "page"]);
  return isEqual(pageQueryStrings, computedQueryStrings);
};
