import { getByDomain } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { isEditor } from "@/utils/common";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const projectId = router.query.id as string | undefined;

  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );

  const url = typeof window !== "undefined" ? window.location.host : "";
  const isEditorUrl = isEditor(url);

  useEffect(() => {
    const setLiveIfHasCustomDomain = async () => {
      try {
        let _projectId = projectId;
        if (!projectId) {
          const project = await getByDomain(url);
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

  return !isEditorUrl;
};
