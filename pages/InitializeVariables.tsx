import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { useEffect } from "react";

type Props = {
  pageProps: any;
};

export const useInitializeVariables = ({ pageProps }: Props) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
  const pageId = useEditorStore((state) => state.currentPageId);
  const _projectId = pageProps.id || projectId;
  const _pageId = pageProps.page?.id || pageId;
  const initializeVariableList = useVariableStore(
    (state) => state.initializeVariableList,
  );

  const { data: variables, isLoading: isVariablesFetching } =
    useVariableListQuery(_projectId);

  useEffect(() => {
    if (!isVariablesFetching && variables?.results)
      initializeVariableList(variables?.results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_pageId, variables?.results, isVariablesFetching]);
};

// export default InitializeVariables;
