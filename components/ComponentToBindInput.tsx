import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { ActionIcon, TextInput } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useEditorStore } from "@/stores/editor";

export const ComponentToBindInput = ({
  value,
  componentId,
  index,
  onPick,
  placeholder = "",
  label = "Component to bind",
}: any) => {
  const { setPickingComponentToBindTo } = useEditorStore();

  const onBindComponent = () => {
    setPickingComponentToBindTo({
      componentId: componentId,
      trigger: "",
      onPick,
    });
  };

  return (
    <TextInput
      size="xs"
      placeholder={placeholder}
      label={label}
      value={value}
      rightSection={
        <>
          <ComponentToBindActionsPopover inputIndex={index} onPick={onPick} />
          <ActionIcon onClick={onBindComponent}>
            <IconCurrentLocation size={ICON_SIZE} />
          </ActionIcon>
        </>
      }
      styles={{
        input: { paddingRight: "3.65rem" },
        rightSection: { width: "3.65rem" },
      }}
    />
  );
};
