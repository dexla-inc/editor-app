import { useRouter } from "next/router";

export const useNextRouter = () => {
  const router = useRouter();

  const { id: projectId, page: pageId } = router.query as {
    id: string;
    page: string;
  };

  return { projectId, pageId };
};
