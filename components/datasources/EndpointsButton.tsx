import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { LoadingStore } from "@/types/dashboardTypes";
import { Button } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

interface EndpointsButtonProps extends LoadingStore {
  projectId: string;
}

export default function EndpointsButton({
  isLoading,
  startLoading,
  stopLoading,
  projectId,
}: EndpointsButtonProps) {
  const router = useRouter();
  const pages = useEditorStore((state) => state.pages);

  const goToEditor = async (projectId: string) => {
    startLoading({
      id: "editor-load",
      title: "Editor Is Loading",
      message: "Wait while the editor is loading",
    });

    router.push(`/projects/${projectId}/editor/${pages[0].id}`);
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
