import { withModifier } from "@/hoc/withModifier";
import { inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import startCase from "lodash.startcase";
import { useEffect } from "react";
import { SegmentedControlSizes } from "../SegmentedControlSizes";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  const data: Record<string, typeof inputSizes> = {
    size: inputSizes,
    radius: radiusSizes,
  };

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.colorPicker, {
        size: selectedComponent.props?.size,
        radius: selectedComponent.props?.radius,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <Stack spacing="xs">
      {["size", "radius"].map((key) => (
        <SegmentedControlSizes
          key={key}
          label={startCase(key)}
          sizing={data[key]}
          {...form.getInputProps(key)}
          onChange={(value) => {
            form.setFieldValue(key, value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  [key]: value,
                },
              },
            });
          }}
        />
      ))}
    </Stack>
  );
});

export default Modifier;
