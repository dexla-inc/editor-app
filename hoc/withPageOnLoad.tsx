import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useTriggers } from "@/hooks/useTriggers";
import { PageResponse } from "@/requests/pages/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const withPageOnLoad = (WrappedComponent: any) => {
  const Config = (props: any) => {
    const {
      asPath,
      query: { id: projectId, page: pageId },
    } = useRouter();
    const { data: pageListQuery } = usePageListQuery(projectId as string);
    const page = pageListQuery?.results?.find(
      (item) => item.id === pageId,
    ) as PageResponse;
    const { onPageLoad } = useTriggers({ entity: page });
    const [actionTriggeredForPath, setActionTriggeredForPath] = useState("");

    const isPageValid = page && asPath.includes(page.id);

    useEffect(() => {
      const triggerPageActions = async () => {
        if (isPageValid && onPageLoad && actionTriggeredForPath !== asPath) {
          await onPageLoad?.();
          setActionTriggeredForPath(asPath); // Mark this path as having triggered the action
        }
      };

      triggerPageActions();
    }, [asPath, onPageLoad]);

    return <WrappedComponent {...props} />;
  };

  return Config;
};
