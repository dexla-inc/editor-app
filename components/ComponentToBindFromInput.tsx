import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { ActionIcon, Group, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useEditorStore } from "@/stores/editor";
import { VariablePicker } from "@/components/VariablePicker";

type Props = TextInputProps & {
  componentId?: string;
  index?: number;
  onPickComponent?: (value: string) => void;
  onPickVariable?: (value: string) => void;
};

export const ComponentToBindFromInput = ({
  componentId,
  index,
  onPickComponent,
  onPickVariable,
  placeholder = "",
  label = "Component to bind",
  ...rest
}: Props) => {
  const { setPickingComponentToBindFrom, setHighlightedComponentId } =
    useEditorStore();

  const onBindComponent = () => {
    if (componentId) {
      setPickingComponentToBindFrom({
        componentId,
        trigger: "",
        onPick: onPickComponent,
      });
    }
  };

  return (
    <TextInput
      size="xs"
      placeholder={placeholder}
      label={label}
      onFocus={(e) => {
        setHighlightedComponentId(e.target.value);
      }}
      onBlur={() => {
        setHighlightedComponentId(null);
      }}
      rightSection={
        <Group noWrap spacing={0}>
          <VariablePicker onSelectValue={onPickVariable} />
          <ComponentToBindActionsPopover
            inputIndex={index}
            onPick={onPickComponent}
          />
          <ActionIcon onClick={onBindComponent} size="xs">
            <IconCurrentLocation size={ICON_SIZE} />
          </ActionIcon>
        </Group>
      }
      styles={{
        input: { paddingRight: "3.65rem" },
        rightSection: { width: "3.65rem" },
      }}
      {...rest}
    />
  );
};
