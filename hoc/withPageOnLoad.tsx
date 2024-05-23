import { useTriggers } from "@/hooks/components/useTriggers";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePageQuery } from "@/hooks/editor/reactQuery/usePageQuery";
import { DeploymentPage } from "@/requests/deployments/types";
import { EditorTreeCopy } from "@/utils/editor";

// Props from server side
type Props = {
  deploymentPage: DeploymentPage;
  pageState: EditorTreeCopy;
};

export const withPageOnLoad = (
  WrappedComponent: any,
  config: { isLive?: boolean },
) => {
  const PageOnLoadWrapper = (props: Props) => {
    const router = useRouter();
    const pathName = usePathname();
    const { id: projectId, page: pageId } = useParams<{
      id: string;
      page: string;
    }>();

    const { data: editorPage } = usePageQuery(
      projectId,
      pageId,
      !config.isLive,
    );

    const page = config.isLive ? props.deploymentPage : editorPage;

    const { onPageLoad } = useTriggers({
      // @ts-ignore
      entity: page,
      router,
      projectId: props.deploymentPage.project?.id || projectId,
    });

    const [actionTriggeredForPath, setActionTriggeredForPath] = useState("");

    useEffect(() => {
      const triggerPageActions = async () => {
        const isPageValid =
          page && (pathName.includes(page.id) || pathName.includes(page.slug));
        // TODO: Do not run when runInEditMode is false and the mode is editor.
        // TODO: Only the last action gets run

        if (isPageValid && onPageLoad && actionTriggeredForPath !== pathName) {
          await onPageLoad?.();
          setActionTriggeredForPath(pathName);
        }
      };

      triggerPageActions();
    }, [pathName, page?.id, onPageLoad, actionTriggeredForPath, page]);

    return <WrappedComponent {...props} />;
  };

  return PageOnLoadWrapper;
};
