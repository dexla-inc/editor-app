import { getPageList } from "@/requests/pages/queries-noauth";
import { ICON_SIZE } from "@/utils/config";
import { LoadingStore } from "@/utils/dashboardTypes";
import { Button } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

interface EndpointsButtonProps extends LoadingStore {
  projectId: string;
  text?: string | undefined;
}

export default function EndpointsButton({
  isLoading,
  startLoading,
  stopLoading,
  projectId,
  text,
}: EndpointsButtonProps) {
  const router = useRouter();

  const goToEditor = async (projectId: string) => {
    startLoading({
      id: "editor-load",
      title: "Editor Is Loading",
      message: "Wait while the editor is loading",
    });

    const result = await getPageList(projectId, { isHome: true });

    if (result.results.length === 0) {
      stopLoading({
        id: "editor-load",
        title: "There was a problem",
        message: "You need to create a project with some pages first",
      });

      return;
    }

    router.push(`/projects/${projectId}/editor/${result.results[0].id}`);
  };

  return (
    <Button
      onClick={() => goToEditor(projectId)}
      loading={isLoading}
      disabled={isLoading}
      rightIcon={<IconArrowUpRight size={ICON_SIZE} />}
    >
      Go to editor
    </Button>
  );
}
