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
    const { data: pageListQuery } = usePageListQuery(projectId as string, null);
    const page = pageListQuery?.results?.find(
      (item) => item.id === pageId || item.slug === pageId,
    ) as PageResponse;

    const { onPageLoad } = useTriggers({ entity: page });
    const [actionTriggeredForPath, setActionTriggeredForPath] = useState("");

    useEffect(() => {
      const triggerPageActions = async () => {
        const isPageValid = page && asPath.includes(page.id);
        // TODO: Do not run when runInEditMode is false and the mode is editor.
        // TODO: Only the last action gets run
        if (isPageValid && onPageLoad && actionTriggeredForPath !== asPath) {
          await onPageLoad?.();
          setActionTriggeredForPath(asPath);
        }
      };

      triggerPageActions();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asPath, page?.id]);

    return <WrappedComponent {...props} />;
  };

  return Config;
};
