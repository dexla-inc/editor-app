import { Live } from "@/components/Live";
import { useEditorStore } from "@/stores/editor";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
      page: query.page,
    },
  };
};

type Props = {
  id: string;
  page: string;
};

export default function LivePage({ id, page }: Props) {
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const setIsLive = useEditorStore((state) => state.setIsLive);

  useEffect(() => {
    if (id && page) {
      setCurrentProjectId(id);
      setCurrentPageId(page);
      setPreviewMode(true);
      setIsLive(true);
    }
  }, [
    id,
    page,
    setCurrentPageId,
    setCurrentProjectId,
    setPreviewMode,
    setIsLive,
  ]);

  return <Live key={page} pageId={page} projectId={id} />;
}
