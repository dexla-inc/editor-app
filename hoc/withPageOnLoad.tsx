import { useTriggers } from "@/hooks/components/useTriggers";
import { NextRouter, Router } from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageResponse } from "@/requests/pages/types";
import { ProjectResponse } from "@/requests/projects/types";
import { usePageQuery } from "@/hooks/editor/reactQuery/usePageQuery";

// Props from server side
type Props = {
  isLive: boolean;
  deploymentPage: PageResponse;
  project: ProjectResponse;
};

export const withPageOnLoad = (
  WrappedComponent: any,
  config: { isLive?: boolean },
) => {
  const PageOnLoadWrapper = (props: Props) => {
    const router = useRouter();
    const { id: projectId, page: pageId } = router.query as {
      id: string;
      page: string;
    };

    const { data: editorPage } = usePageQuery(
      projectId,
      pageId,
      !config.isLive,
    );

    const page = config.isLive ? props.deploymentPage : editorPage;

    const { onPageLoad } = useTriggers({
      // @ts-ignore
      entity: page,
      router: router,
      projectId: props.project?.id || projectId,
    });

    const [actionTriggeredForPath, setActionTriggeredForPath] = useState("");

    useEffect(() => {
      const triggerPageActions = async () => {
        const isPageValid =
          page &&
          (router.asPath.includes(page.id) ||
            router.asPath.includes(page.slug));
        // TODO: Do not run when runInEditMode is false and the mode is editor.
        // TODO: Only the last action gets run

        if (
          isPageValid &&
          onPageLoad &&
          actionTriggeredForPath !== router.asPath
        ) {
          await onPageLoad?.();
          setActionTriggeredForPath(router.asPath);
        }
      };

      triggerPageActions();
    }, [router.asPath, page?.id, onPageLoad, actionTriggeredForPath, page]);

    return <WrappedComponent {...props} />;
  };

  return PageOnLoadWrapper;
};
