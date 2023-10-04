import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useEditorStore } from "@/stores/editor";

type Props = TextInputProps & {
  componentId?: string;
  index?: number;
  onPick: (value: string) => void;
};

export const ComponentToBindInput = ({
  value,
  componentId,
  index,
  onPick,
  placeholder = "",
  label = "Component to bind",
  ...rest
}: Props) => {
  const setHighlightedComponentId = useEditorStore(
    (state) => state.setHighlightedComponentId,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  const onBindComponent = () => {
    if (componentId) {
      setPickingComponentToBindTo({
        componentId: componentId,
        trigger: "",
        onPick,
      });
    }
  };

  return (
    <TextInput
      size="xs"
      placeholder={placeholder}
      label={label}
      value={value}
      onFocus={(e) => {
        setHighlightedComponentId(e.target.value);
      }}
      onBlur={() => {
        setHighlightedComponentId(null);
      }}
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
      {...rest}
    />
  );
};
