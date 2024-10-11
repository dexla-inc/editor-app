import { ICON_SIZE } from "@/utils/config";
import { LoadingStore } from "@/types/dashboardTypes";
import { Button } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import Link from "next/link";

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
  const { data: pageListQuery } = usePageListQuery(projectId);

  const page =
    pageListQuery?.results.find((p) => p.isHome === true) ||
    pageListQuery?.results[0];

  const editorPath = `/projects/${projectId}/editor/${page?.id}`;

  return (
    <Button
      component={Link}
      href={editorPath}
      onClick={(e) => {
        if (isLoading) {
          // Prevent navigation if loading is true
          e.preventDefault();
          return;
        }

        startLoading({
          id: "go-to-editor",
          title: "Loading App",
          message: "Wait while we load the editor for your project",
        });

        if (closeModal) {
          closeModal();
        }
      }}
      loading={isLoading}
      disabled={isLoading}
      rightIcon={<IconArrowUpRight size={ICON_SIZE} />}
    >
      Go to editor
    </Button>
  );
}
