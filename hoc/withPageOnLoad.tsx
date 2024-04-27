import { useTriggers } from "@/hooks/useTriggers";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageResponse } from "@/requests/pages/types";
import { ProjectResponse } from "@/requests/projects/types";
import { usePageQuery } from "@/hooks/reactQuery/usePageQuery";

// Props from server side
type Props = {
  isLive: boolean;
  deploymentPage: PageResponse;
  project: ProjectResponse;
};

export const withPageOnLoad = (WrappedComponent: any) => {
  const PageOnLoadWrapper = (props: Props) => {
    const router = useRouter();
    const { id: projectId, page: pageId } = router.query as {
      id: string;
      page: string;
    };

    const source = WrappedComponent.type?.name; // If "PageEditor" then get page actions from page. If deployed then deploymentPage
    const isEditor = source === "PageEditor";

    const { data: editorPage } = usePageQuery(projectId, pageId, isEditor);

    const page = isEditor ? editorPage : props.deploymentPage;

    const { onPageLoad } = useTriggers({
      // @ts-ignore
      entity: page,
      router: router as Router,
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath, page?.id, props, onPageLoad]);

    return <WrappedComponent {...props} />;
  };

  return PageOnLoadWrapper;
};
