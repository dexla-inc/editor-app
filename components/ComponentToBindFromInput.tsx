import BindingPopover from "@/components/BindingPopover";
import { useEditorStore } from "@/stores/editor";
import { Flex, TextInput, TextInputProps } from "@mantine/core";
import { ValueProps } from "@/utils/types";

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
        // TODO: uncomment this when we have the ability to bind components
        // rightSection={
        //   onPickComponent &&
        //   !isLogicFlow && (
        //     <ActionIcon onClick={onBindComponent} size="xs">
        //       <IconCurrentLocation size={ICON_SIZE} />
        //     </ActionIcon>
        //   )
        // }
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
