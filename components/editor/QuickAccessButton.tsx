import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useQuickAccess } from "@/hooks/editor/useQuickAccess";
import { memo } from "react";

type Props = {
  projectId: string;
};

const QuickAccessButton = ({ projectId }: Props) => {
  const { openModal } = useQuickAccess({ projectId });

  const handleClick = () => {
    openModal();
  };

  return (
    <ActionIconDefault
      iconName="IconDatabaseImport"
      tooltip="Add data"
      onClick={handleClick}
    />
  );
};

export default memo(QuickAccessButton);
