import { useTriggers } from "@/hooks/useTriggers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DeploymentPage } from "@/requests/deployments/types";
import { PageResponse } from "@/requests/pages/types";

// Props from server side
type Props = {
  deploymentPage: PageResponse;
};

export const withPageOnLoad = (WrappedComponent: any) => {
  const Config = (props: Props) => {
    const { asPath } = useRouter();
    const page = props.deploymentPage;

    const { onPageLoad } = useTriggers({ entity: page });
    const [actionTriggeredForPath, setActionTriggeredForPath] = useState("");

    useEffect(() => {
      const triggerPageActions = async () => {
        const isPageValid =
          page && (asPath.includes(page.id) || asPath.includes(page.slug));
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
