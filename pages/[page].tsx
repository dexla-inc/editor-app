import { Live } from "@/components/Live";
import { useEditorStore } from "@/stores/editor";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

function isMatchingUrl(url: string): boolean {
  const pattern = /^.*\.dexla\.io$/;

  // Use the test() method of the regular expression to check if the URL matches the pattern
  return pattern.test(url);
}

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host;

  let id = query.id ?? "";
  if (isMatchingUrl(url!) || url?.endsWith(".localhost:3000")) {
    id = url?.split(".")[0] as string;
  }

  return {
    props: {
      id,
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
