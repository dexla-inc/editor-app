import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { VariablePicker } from "@/components/VariablePicker";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Group, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";

type Props = TextInputProps & {
  componentId?: string;
  onPickComponent?: (value: string) => void;
  onPickVariable?: (value: string) => void;
};

export const ComponentToBindFromInput = ({
  componentId,
  onPickComponent,
  onPickVariable,
  placeholder = "",
  label = "Component to bind",
  ...rest
}: Props) => {
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setHighlightedComponentId = useEditorStore(
    (state) => state.setHighlightedComponentId,
  );

  const onBindComponent = () => {
    setPickingComponentToBindTo({
      componentId: componentId || "",
      onPick: onPickComponent,
    });
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
          {onPickVariable && <VariablePicker onSelectValue={onPickVariable} />}
          {onPickComponent && (
            <>
              <ComponentToBindActionsPopover onPick={onPickComponent} />

              <ActionIcon onClick={onBindComponent} size="xs">
                <IconCurrentLocation size={ICON_SIZE} />
              </ActionIcon>
            </>
          )}
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
