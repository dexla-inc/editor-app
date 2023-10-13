import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { VariablePicker } from "@/components/VariablePicker";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Group, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";

type Props = TextInputProps & {
  componentId?: string;
  bindAttributes?: Record<string, string>;
  index?: number;
  onPickComponent?: (value: string) => void;
  onPickVariable?: (value: string) => void;
};

export const ComponentToBindFromInput = ({
  componentId,
  index,
  onPickComponent,
  onPickVariable,
  bindAttributes,
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
        ...bindAttributes,
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
