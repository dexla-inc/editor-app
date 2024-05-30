import { ICON_SIZE } from "@/utils/config";
import { LoadingStore } from "@/types/dashboardTypes";
import { Button } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";

interface EndpointsButtonProps extends LoadingStore {
  projectId: string;
  closeModal?: any;
}

export default function EndpointsButton({
  isLoading,
  startLoading,
  projectId,
  closeModal,
}: EndpointsButtonProps) {
  const router = useRouter();
  const { data: pageListQuery } = usePageListQuery(projectId);

  const goToEditor = async (projectId: string) => {
    startLoading({
      id: "editor-load",
      title: "Editor Is Loading",
      message: "Wait while the editor is loading",
    });

    const page =
      pageListQuery?.results.find((p) => p.isHome === true) ||
      pageListQuery?.results[0]!;

    router.push(`/projects/${projectId}/editor/${page.id}`);
  };

  return (
    <Button
      onClick={closeModal ? closeModal : () => goToEditor(projectId)}
      loading={isLoading}
      disabled={isLoading}
      rightIcon={<IconArrowUpRight size={ICON_SIZE} />}
    >
      Go to editor
    </Button>
  );
}
