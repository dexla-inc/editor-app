import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { NumberInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLoader2 } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SizeSelector } from "../SizeSelector";
import { SwitchSelector } from "../SwitchSelector";

export const icon = IconLoader2;
export const label = "Progress";

const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.progress, {
        color: selectedComponent.props?.color,
        size: selectedComponent.props?.size,
        value: selectedComponent.props?.value,
        animate: selectedComponent.props?.animate,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  color: value,
                },
              },
            });
          }}
        />
        <SizeSelector
          label="Size"
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: { size: value },
              },
            });
          }}
          showNone={false}
        />
        <NumberInput
          label="Value"
          size="xs"
          min={0}
          max={100}
          {...form.getInputProps("value")}
          onChange={(value) => {
            form.setFieldValue("value", value as number);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: { value: value },
              },
            });
          }}
        />
        <SwitchSelector
          topLabel="Animate"
          {...form.getInputProps("animate")}
          checked={selectedComponent.props?.animate}
          onChange={(event) => {
            form.setFieldValue("animate", event.currentTarget.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: { animate: event.currentTarget.checked },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
