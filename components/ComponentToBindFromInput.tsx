import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/utils/types";
import { NumberInput, TextInput } from "@mantine/core";
import { SegmentedControlYesNo } from "./SegmentedControlYesNo";
import { FieldType } from "./data/forms/StaticFormFieldsBuilder";

// Need to extend input props depending on fieldType
type Props = {
  componentId?: string;
  onPickComponent?: () => void;
  isLogicFlow?: boolean;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  fieldType?: FieldType;
  placeholder?: string;
  label?: string;
  defaultValue?: any;
  decimalPlaces?: number;
};

export const ComponentToBindFromInput = ({
  componentId,
  onPickComponent,
  placeholder = "",
  label = "Component to bind",
  isLogicFlow,
  value,
  onChange,
  fieldType = "text",
  defaultValue,
  decimalPlaces,
  ...props
}: Props) => {
  const setHighlightedComponentId = useEditorStore(
    (state) => state.setHighlightedComponentId,
  );

  const commonProps = {
    label,
    onFocus: (e: any) => {
      setHighlightedComponentId(e.target.value);
    },
    onBlur: () => {
      setHighlightedComponentId(null);
    },
    ...AUTOCOMPLETE_OFF_PROPS,
  };

  return (
    <ComponentToBindWrapper onChange={onChange} value={value}>
      {fieldType === "text" ? (
        <TextInput
          {...commonProps}
          placeholder={placeholder}
          value={value?.static}
          onChange={(e) =>
            onChange({
              ...value,
              dataType: "static",
              static: e.currentTarget.value,
            })
          }
          {...props}
        />
      ) : fieldType === "number" ? (
        <NumberInput
          {...commonProps}
          placeholder={placeholder}
          value={parseInt(value?.static, decimalPlaces) || defaultValue}
          onChange={(val) =>
            onChange({
              ...value,
              dataType: "static",
              static: val.toString(),
            })
          }
          precision={decimalPlaces}
          {...props}
        />
      ) : fieldType === "yesno" ? (
        <SegmentedControlYesNo
          {...commonProps}
          value={value?.static}
          onChange={(val) =>
            onChange({
              ...value,
              dataType: "static",
              static: val.toString(),
            })
          }
          w="100%"
        />
      ) : null}
    </ComponentToBindWrapper>
  );
};
