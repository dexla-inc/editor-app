import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useQuickAccess } from "@/hooks/editor/useQuickAccess";
import { ActionIconProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  projectId: string;
  id?: string;
} & ActionIconProps;

const QuickAccessButton = ({ projectId, id }: Props) => {
  const { openModal } = useQuickAccess({ projectId });

  const handleClick = () => {
    openModal();
  };

  return (
    <ActionIconDefault
      id={id}
      iconName="IconDatabaseImport"
      tooltip="Add data"
      onClick={handleClick}
    />
  );
};

export default memo(QuickAccessButton);
