import BindingPopover from "@/components/BindingPopover";
import { useEditorStore } from "@/stores/editor";
import { Flex, TextInput, TextInputProps } from "@mantine/core";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/utils/types";
import { useDisclosure } from "@mantine/hooks";

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
  const [
    isBindingPopOverOpen,
    { open: onOpenBindingPopOver, close: onCloseBindingPopOver },
  ] = useDisclosure(false);

  const onBindComponent = () => {
    setPickingComponentToBindTo({
      componentId: componentId || "",
      onPick: onPickComponent,
    });
  };

  return (
    <Flex align="end" gap="xs" pos="relative">
      {value.dataType === "boundCode" && (
        <TextInput
          pos="absolute"
          w="100%"
          styles={{
            root: { zIndex: 100 },
            input: {
              cursor: "pointer",
              "&:disabled": { opacity: 1 },
            },
          }}
          readOnly
          value="< Edit Code >"
          disabled={isBindingPopOverOpen}
          onClick={onOpenBindingPopOver}
        />
      )}
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
        {...AUTOCOMPLETE_OFF_PROPS}
      />
      <BindingPopover
        value={value}
        onChange={onChange}
        controls={{
          isOpen: isBindingPopOverOpen,
          onClose: onCloseBindingPopOver,
          onOpen: onOpenBindingPopOver,
        }}
        style="iconButton"
      />
    </Flex>
  );
};
