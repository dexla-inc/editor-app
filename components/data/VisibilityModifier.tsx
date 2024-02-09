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
  const defaultValue = getComponentInitialDisplayValue(componentName);
  const value = form.getInputProps("props.style.display").value;
  const visibleValue = computeValue({
    value,
    staticFallback: defaultValue,
  });

  return (
    <ComponentToBindWrapper {...form.getInputProps("props.style.display")}>
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
          {...form.getInputProps("props.style.display")}
          value={visibleValue}
          onChange={(_value) => {
            form.setFieldValue("props.style.display", {
              ...value,
              dataType: "static",
              static: _value,
            });
          }}
        />
      </Stack>
    </ComponentToBindWrapper>
  );
};
