import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { ActionIcon, TextInput } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useEditorStore } from "@/stores/editor";

export const ComponentToBindInput = ({
  value,
  componentId,
  triggerTo,
  index,
}: any) => {
  const { setPickingComponentToBindTo } = useEditorStore();

  return (
    <TextInput
      size="xs"
      label="Component to bind"
      value={value}
      rightSection={
        <>
          <ComponentToBindActionsPopover inputIndex={index} />
          <ActionIcon
            onClick={() => {
              setPickingComponentToBindTo({
                componentId: componentId,
                trigger: triggerTo,
                bindedId: value ?? "",
                ...(index ?? { index }),
              });
            }}
          >
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
