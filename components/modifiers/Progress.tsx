import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { SizeSelector } from "../SizeSelector";
import { useEffect } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge(
        {},
        requiredModifiers.progress,
        { size: "xs" },
        {
          color: selectedComponent.props?.color,
          size: selectedComponent.props?.size,
          value: selectedComponent.props?.value,
          animate: selectedComponent.props?.animate,
        },
      ),
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
        <SegmentedControlYesNo
          label="Animate"
          {...form.getInputProps("animate")}
          onChange={(value) => {
            form.setFieldValue("animate", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { animate: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
