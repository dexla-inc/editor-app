import { useTriggers } from "@/hooks/components/useTriggers";
import { usePathname } from "next/navigation";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";
import { useEffect, useState } from "react";
import { DeploymentPage } from "@/requests/deployments/types";
import { PageResponse } from "@/requests/pages/types";

// Props from server side
type Props = {
  page?: DeploymentPage | PageResponse;
  projectId: string;
};

export const withPageOnLoad = <T extends {}>(WrappedComponent: any) => {
  const PageOnLoadWrapper = (props: Props & T) => {
    const { page, projectId } = props;
    const router = useRouterWithLoader();
    const pathName = usePathname();

    const { onPageLoad } = useTriggers({
      // @ts-ignore
      entity: page,
      router,
      projectId: page?.project?.id || projectId,
    });

    const [actionTriggeredForPath, setActionTriggeredForPath] = useState("");

    useEffect(() => {
      const triggerPageActions = async () => {
        const isPageValid =
          page &&
          (pathName?.includes(page.id) || pathName?.includes(page.slug));
        // TODO: Do not run when runInEditMode is false and the mode is editor.
        // TODO: Only the last action gets run

        if (isPageValid && onPageLoad && actionTriggeredForPath !== pathName) {
          await onPageLoad?.();
          pathName && setActionTriggeredForPath(pathName);
        }
      };

      triggerPageActions();
    }, [pathName, page?.id, onPageLoad, actionTriggeredForPath, page]);

    return <WrappedComponent {...props} />;
  };

  return PageOnLoadWrapper;
};
