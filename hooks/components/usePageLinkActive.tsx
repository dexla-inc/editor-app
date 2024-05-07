import { useRouter } from "next/router";
import { ValueProps } from "@/types/dataBinding";
import isEqual from "lodash.isequal";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { omit } from "next/dist/shared/lib/router/utils/omit";

export const usePageLinkActive = (
  queryStrings?: Array<{ key: string; value: ValueProps }>,
) => {
  const router = useRouter();
  const { computeValue } = useDataBinding();
  if (!queryStrings) {
    return true;
  }
  const pageQueryStrings = omit(router.query, ["id", "page"]);
  const computedQueryStrings = queryStrings.reduce(
    (acc, next) => {
      acc[next.key] = computeValue<string>({ value: next.value });
      return acc;
    },
    {} as Record<string, string>,
  );
  return isEqual(pageQueryStrings, computedQueryStrings);
};
