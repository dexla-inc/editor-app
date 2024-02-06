import { getProject } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { getProjectType } from "@/utils/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const projectId = router.query.id as string | undefined;

  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );

  const [urlType, setUrlType] = useState("");

  // Need this to check the type of page
  useEffect(() => {
    const hrefUrl = typeof window !== "undefined" ? window.location.href : "";
    const currentUrlType = getProjectType(hrefUrl);
    if (urlType !== currentUrlType) {
      setUrlType(currentUrlType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  // Only do this when page refreshes
  useEffect(() => {
    const setLiveIfHasCustomDomain = async () => {
      try {
        let _projectId = projectId;
        if (!projectId && urlType === "live") {
          const hostUrl =
            typeof window !== "undefined" ? window.location.host : "";
          const project = await getProject(hostUrl, true);
          _projectId = project.id ?? projectId;
        }

        setCurrentProjectId(_projectId as string);
      } catch (error) {
        console.error("Error checking if live:", error);
      }
    };

    setLiveIfHasCustomDomain();
    // @ts-ignore
  }, [router?.state?.pathname]);

  return urlType === "live";
};
