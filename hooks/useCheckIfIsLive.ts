import { getProject } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { getProjectType } from "@/utils/common";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const projectId = router.query.id as string | undefined;

  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );

  const hrefUrl = typeof window !== "undefined" ? window.location.href : "";
  const urlType = getProjectType(hrefUrl);
  console.log("useCheckIfIsLive", urlType);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.state?.pathname]);

  return urlType === "live";
};
