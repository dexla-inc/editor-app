import { useCallback } from "react";
import { patchProject } from "@/requests/projects/mutations";
import { modals } from "@mantine/modals";
import { Flex, Title } from "@mantine/core";
import { Icon } from "@/components/Icon";
import { LARGE_ICON_SIZE } from "@/utils/config";

type Props = {
  projectId: string;
};

export const useQuickAccess = ({ projectId }: Props) => {
  const onClose = useCallback(async () => {
    await patchProject(projectId, [
      {
        op: "replace",
        path: "/metadata/showOnboarding",
        value: false,
      },
    ]);
  }, [projectId]);

  const openModal = useCallback(
    () =>
      modals.openContextModal({
        modal: "quickAccess",
        onClose: onClose,
        title: (
          <Flex gap="sm">
            <Icon size={LARGE_ICON_SIZE} name="IconDatabaseImport" />
            <Title order={3}>Data Connector</Title>
          </Flex>
        ),
        size: "xl",
        styles: {
          title: { width: "100%" },
          overlay: { zIndex: 310 },
          inner: { zIndex: 310 },
        },
        innerProps: {},
      }),
    [onClose],
  );

  return {
    openModal,
  };
};
