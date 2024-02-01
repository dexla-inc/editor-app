import BindingPopover from "@/components/BindingPopover";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Flex, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";

type ValueProps = {
  dataType: string;
  static: string;
  dynamic: string;
  boundCode: (props: Record<string, any>) => any;
};

type Props = Omit<TextInputProps, "value" | "onChange"> & {
  componentId?: string;
  onPickComponent?: (value: string) => void;
  isLogicFlow?: boolean;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
};

export const ComponentToBindFromInput = ({
  componentId,
  onPickComponent,
  placeholder = "",
  label = "Component to bind",
  isLogicFlow,
  value,
  onChange,
  ...props
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
    <Flex align="end" gap="xs">
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
          onPickComponent &&
          !isLogicFlow && (
            <ActionIcon onClick={onBindComponent} size="xs">
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          )
        }
        styles={{
          ...(!isLogicFlow && {
            rightSection: { width: "3.65rem", justifyContent: "flex-end" },
          }),
        }}
        value={value?.static}
        onChange={(e) => {
          onChange({
            ...value,
            static: e.currentTarget.value,
          });
        }}
        {...props}
      />
      <BindingPopover value={value} onChange={onChange} style="iconButton" />
    </Flex>
  );
};
