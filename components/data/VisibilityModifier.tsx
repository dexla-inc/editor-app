import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { useDataContext } from "@/contexts/DataProvider";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Stack } from "@mantine/core";
import { ComponentToBindWrapper } from "../ComponentToBindWrapper";

type Props = {
  form: any;
  componentId: string;
  componentName: string;
};

export const VisibilityModifier = ({ componentName, form }: Props) => {
  const { computeValue } = useDataContext()!;
  const inputKey = "props.style.display";
  const inputProps = form.getInputProps(inputKey);
  const defaultValue = getComponentInitialDisplayValue(componentName);
  const visibleValue = computeValue({
    value: inputProps.value,
    staticFallback: defaultValue,
  });

  return (
    <ComponentToBindWrapper {...inputProps}>
      <Stack w="100%">
        <SegmentedControlInput
          label="Visibility"
          data={[
            {
              label: "Visible",
              value: getComponentInitialDisplayValue(componentName),
            },
            {
              label: "Hidden",
              value: "none",
            },
          ]}
          {...form.getInputProps(inputKey)}
          value={visibleValue}
          onChange={(_value) => {
            form.setFieldValue(inputKey, {
              ...inputProps.value,
              dataType: "static",
              static: _value,
            });
          }}
        />
      </Stack>
    </ComponentToBindWrapper>
  );
};
