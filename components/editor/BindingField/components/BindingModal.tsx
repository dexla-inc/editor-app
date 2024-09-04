import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Modal, Tooltip } from "@mantine/core";
import { IconArrowsMaximize } from "@tabler/icons-react";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function BindingModal({ isOpen, onOpen, onClose }: Props) {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField();
  const Component =
    ComponentToBindField?.[fieldType as keyof typeof ComponentToBindField];

  return (
    <>
      <Tooltip label="Expand Logic" withArrow position="top-end">
        <ActionIcon onClick={onOpen} variant="default" tabIndex={-1}>
          <IconArrowsMaximize size={ICON_SIZE} />
        </ActionIcon>
      </Tooltip>
      <Modal opened={isOpen} onClose={onClose} title={label} size="xl">
        <Component
          {...defaultProps}
          value={staticValue}
          onChange={inputOnChange}
          height="450px"
        />
      </Modal>
    </>
  );
}
