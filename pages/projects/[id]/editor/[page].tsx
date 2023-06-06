import { Editor } from "@/components/Editor";
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

export default function PageEditor({ id, page }: Props) {
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);

  useEffect(() => {
    if (id && page) {
      setCurrentProjectId(id);
      setCurrentPageId(page);
    }
  }, [id, page, setCurrentPageId, setCurrentProjectId]);

  return <Editor key={page} pageId={page} projectId={id} />;
}
