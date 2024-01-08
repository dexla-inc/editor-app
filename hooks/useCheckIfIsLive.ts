import { isMatchingUrl } from "@/pages/[page]";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { getByDomain } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const initializeEndpoints = useEditorStore(
    (state) => state.initializeEndpoints,
  );

  const url = typeof window !== "undefined" ? window.location.host : "";
  let initialIsLive = true;

  if (
    router?.asPath === "/[page]" ||
    isMatchingUrl(url) ||
    url.endsWith(".localhost:3000")
  ) {
    initialIsLive = true;
  } else {
    initialIsLive = false;
  }

  const [isLive, setIsLive] = useState(initialIsLive);

  useEffect(() => {
    const setLiveIfHasCustomDomain = async () => {
      try {
        const project = await getByDomain(url);

        if (project.id) {
          setIsLive(!!project.id);
        }
        await getCachedEndpoints(project.id ?? projectId);
      } catch (error) {
        console.error("Error checking if live:", error);
      }
    };

    const getCachedEndpoints = async (projectId: string) => {
      const { results } = await getDataSourceEndpoints(projectId);

      initializeEndpoints(results);
    };

    setLiveIfHasCustomDomain();
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.state?.pathname]);

  return isLive;
};
