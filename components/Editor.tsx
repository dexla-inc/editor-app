import { Shell } from "@/components/AppShell";
import { EditorCanvas } from "@/components/EditorCanvas";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useUserConfigStore } from "@/stores/userConfig";
import { globalStyles } from "@/utils/branding";
import { Global } from "@mantine/core";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Aside } from "@/components/aside/Aside";
import { useLiveBlocks } from "@/hooks/editor/useLiveBlocks";
import { useGetPageData } from "@/hooks/editor/reactQuery/useGetPageData";

type Props = {
  projectId: string;
  pageId: string;
};

const Editor = ({ projectId, pageId }: Props) => {
  useGetPageData({ projectId, pageId });
  const setCurrentPageAndProjectIds = useEditorTreeStore(
    (state) => state.setCurrentPageAndProjectIds,
  );
  useLiveBlocks({ pageId });
  const setCurrentUser = useEditorTreeStore((state) => state.setCurrentUser);
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const user = usePropelAuthStore((state) => state.user);

  useEffect(() => {
    setCurrentPageAndProjectIds(projectId, pageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, pageId]);

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Shell pos="relative" navbar={<Navbar />} aside={<Aside />}>
        <Global styles={globalStyles(isDarkTheme)} />
        <EditorCanvas projectId={projectId} />
        {/* {cursors} */}
      </Shell>
    </>
  );
};

export default Editor;
