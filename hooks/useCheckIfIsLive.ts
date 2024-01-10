import { isMatchingUrl } from "@/pages/[page]";
import { getByDomain } from "@/requests/projects/queries-noauth";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const projectId = router.query.id;

  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );

  const fetchEndpoints = useDataSourceStore((state) => state.fetchEndpoints);

  const url = typeof window !== "undefined" ? window.location.host : "";
  const initialIsLive =
    router?.asPath === "/[page]" ||
    isMatchingUrl(url) ||
    url.endsWith(".localhost:3000");

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
        fetchEndpoints(_projectId, true);
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
