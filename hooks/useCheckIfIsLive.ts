import { getByDomain } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { isLiveUrl } from "@/utils/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const projectId = router.query.id as string | undefined;

  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );

  const url = typeof window !== "undefined" ? window.location.host : "";
  const initialIsLive = isLiveUrl(url, router);

  const [isLive, setIsLive] = useState(initialIsLive);

  useEffect(() => {
    const setLiveIfHasCustomDomain = async () => {
      try {
        const project = await getByDomain(url);
        const _projectId = project.id ?? projectId;

        if (project.id) {
          setIsLive(!!project.id);
        }
        setCurrentProjectId(_projectId);
      } catch (error) {
        console.error("Error checking if live:", error);
      }
    };

    setLiveIfHasCustomDomain();
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.state?.pathname]);

  return isLive;
};
