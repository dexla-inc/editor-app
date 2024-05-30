import { useCallback } from "react";
import { patchProject } from "@/requests/projects/mutations";
import { modals } from "@mantine/modals";

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
        title: "Quick Access",
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
