import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ICON_SIZE } from "@/utils/config";
import { ValueProps } from "@/utils/types";
import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";

type Props = Omit<TextInputProps, "value" | "onChange"> & {
  componentId?: string;
  onPickComponent?: () => void;
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
      onPick: (componentToBind: string) => {
        onChange({
          ...value,
          dataType: "boundCode",
          boundCode: `return components['${componentToBind}']`,
        });
        onPickComponent?.();
      },
    });
  };

  return (
    <ComponentToBindWrapper onChange={onChange} value={value}>
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
            dataType: "static",
            static: e.currentTarget.value,
          });
        }}
        {...props}
        {...AUTOCOMPLETE_OFF_PROPS}
      />
    </ComponentToBindWrapper>
  );
};
