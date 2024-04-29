import { useEditorTreeStore } from "@/stores/editorTree";
import { useEffect } from "react";

type Props = {
  projectId: string;
  pageId?: string;
};

export const useInitialiseLive = ({ projectId, pageId }: Props) => {
  const setCurrentPageAndProjectIds = useEditorTreeStore(
    (state) => state.setCurrentPageAndProjectIds,
  );

  useEffect(() => {
    setCurrentPageAndProjectIds(projectId, pageId ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
